const WebSocket = require('ws');

const ws = new WebSocket('ws://gkdark.geektr.co/websocket/');

ws.on('open', function open() {
  
  let data = {
    code:"100",
    userName:"root",
    avatarUrl:"xxxxxxx",
    uid:"12",
  }

  let scoreInfo = {
    code:"400",
    userName:"xxx",
    uid:"12",
    score: 17
  }

  ws.send(JSON.stringify(data));
  setTimeout(()=>{
    ws.send(JSON.stringify(scoreInfo));
  },1000)
});

ws.on('message', function incoming(data) {
  console.log(data);
});