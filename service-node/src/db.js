const Redis = require('ioredis');


// redis客户端
// 0号数据库 存放用户信息
const db0 = new Redis({
    port: 6379,          // Redis port
    host: '127.0.0.1',   // Redis host
    family: 4,           // 4 (IPv4) or 6 (IPv6)
    db: 0
});


// redis客户端
// 1号数据库 存放题目
const db1 = new Redis({
    port: 6379,          // Redis port
    host: '127.0.0.1',   // Redis host
    family: 4,           // 4 (IPv4) or 6 (IPv6)
    db: 1
});

// redis客户端
// 2号数据库 存放排行榜
const db2 = new Redis({
    port: 6379,          // Redis port
    host: '127.0.0.1',   // Redis host
    family: 4,           // 4 (IPv4) or 6 (IPv6)
    db: 2
});

module.exports = { db0, db1, db2 }