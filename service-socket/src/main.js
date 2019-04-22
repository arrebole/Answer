
const WebSocket = require('ws');
const https = require("https");
const axios = require("axios");
const { SocketConnection, Identification, Problemset, SyncScore } = require("./utils");

const host = "0.0.0.0";
const port = 3000;
const app = new WebSocket.Server({ host, port });

// 连接队列
const queue = new Map();
let socketNumber = 0;

// 启动日志
console.log(`WebSocket 后端启动 ws://${host}:3000`);

// https 证数忽略
const agent = new https.Agent({
    rejectUnauthorized: false
});

// 监听
app.on('connection', function connection(ws, request) {

    const IP = request.connection.remoteAddress + ":" + request.connection.remotePort;


    // 监听客户端打开socket
    console.log("%s 加入连接 总连接数 %d", IP, ++socketNumber)
    // 监听客户端返回的信息
    ws.on('message', (message) => {
        // 1、json数据转化为js对象
        let received = JSON.parse(message);
        // 2、根据code判断请求
        switch (received["code"]) {

            case "100":
                console.log("%s: 请求联机决斗", IP)
                // 追加到任务队列
                queue.set(IP, new SocketConnection(IP, ws, received));
                // 如果存在两个以上联机队列时开始游戏
                if (queue.size >= 2) {
                    startGame(IP);
                }
                break;

            case "400":
                console.log(received);
                SyncClientScore(received)
                break;

            case "0":
                ws.close();
                break;
        }

    });

    // 监听客户端断开连接
    ws.on('close', (message) => {
        queue.delete(IP);

        console.log("%s: 断开连接 总连接数: %d", IP, --socketNumber);
    })

});

/**
 * 
 * @param {String} ip 
 */
function startGame(ip) {
    console.log("++++++++游戏开始+++++++++")
    let one = queue.get(ip);
    let two = null;

    //随机匹配一个对手
    let i = null
    for (let item of queue) {
        i = item[1];
        if (i.level == one.level && i.ip != one.ip && i.userInfo.userName != one.userInfo.userName && !i.isStartGame) {
            two = i;
            break;
        }
    }
    //匹配不到则退出
    if (two == null) {
        return;
    }

    console.log(`成功匹配用户 ${one.userInfo.userName} vs ${two.userInfo.userName}`)
    queue.delete(one.ip);
    queue.delete(two.ip);


    // 互相发送用户信息
    one.socket.send(JSON.stringify(new Identification(two)));
    two.socket.send(JSON.stringify(new Identification(one)));

    // 发送题目
    // 1、向http服务器 请求题目
    axios.get(`https://127.0.0.1/api/problemset/get?limit=8`, { httpsAgent: agent })
        .then((response) => {
            let data = JSON.stringify(new Problemset(response.data));
            //发送给客户端
            one.socket.send(data);
            two.socket.send(data)
        })

}

// 同步客户端分数
function SyncClientScore(scoreInfo) {
    let score = JSON.stringify(new SyncScore(scoreInfo.score, scoreInfo.userName, scoreInfo.uid))
    app.clients.forEach((client)=>{
        client.send(score);
    })
}

//获取本机ip
function getIPAdress() {
    var interfaces = require('os').networkInterfaces();　　
    for (var devName in interfaces) {　　　　
        var iface = interfaces[devName];　　　　　　
        for (var i = 0; i < iface.length; i++) {
            var alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                return alias.address;
            }
        }　　
    }
}