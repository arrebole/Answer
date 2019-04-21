
// 队列
class SocketConnection {

    constructor(ip, socket, userInfo) {
        this.ip = ip;
        this.socket = socket;
        this.userInfo = userInfo;
        this.isStartGame = false;
    }

}

// 问题
class Problemset{
    constructor(problem){
        this.code = "300"
        this.problemset = problem
    }
}

// 匹配认证
class Identification{
    /**
     * 
     * @param {SocketConnection} conn 
     */
    constructor(conn){
        this.code = "200";
        this.uid = conn.userInfo.uid;
        this.address = conn.ip;
        this.userName = conn.userInfo.userName;
        this.avatarUrl = conn.userInfo.avatarUrl;
    }
}

// 同步分数
class SyncScore{
    constructor(score,userName,uid){
        this.code = "400";
        this.score = score;
        this.userName = userName;
        this.uid = uid;
    }
}

module.exports = {
    SocketConnection,
    Identification,
    Problemset,
    SyncScore,
}