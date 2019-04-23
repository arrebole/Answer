const Redis = require('ioredis');
const DBNumber = 6;
let database = null; // 数据库连接池

// 数据库连接配置
class config {
    /**
     * @param {number} n 
     */
    constructor(n) {
        this.port = 6379;          // Redis port
        this.host = '127.0.0.1';   // Redis host
        this.family = 4;           // 4 (IPv4) or 6 (IPv6)
        this.db = n
    }

};

// redis客户端
// 设计模式： 创建型——单件
// 算法：——
class RedisClients {
    
    // 禁止类实例化
    constructor() {    
        new SyntaxError();
    }


    /**
     * @description 获取数据库的某个表的连接
     * @param {number} n
     * @returns {IORedis.Redis}  Redis连接
     */
    static getTable(n) {
        if (database == null) {
            database = new Array(DBNumber);
            for (let i = 0; i < DBNumber; i++) {
                database[i] = new Redis(new config(i));
            }
        }
        return database[n];
    }
}








module.exports = RedisClients;