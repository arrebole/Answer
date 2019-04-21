const Router = require('koa-router');
const message = require("../utils/message");
const { db1 } = require("../db");
const router = new Router();


// redis客户端
const redis = db1;

// 获取数据库中一共有多少题目 返回 number类型
async function queryProblemsetSize() {
    let dbsize = await redis.dbsize();
    return dbsize;
}

// 获取数据库中所有题目的id 返回 Array类型
async function queryProblemsetKeys() {
    let keys = await redis.keys("*")
    return keys;
}

// 从数据库中随机读取limit数量的题目并返回
async function QueryProblemset(limit) {
    let dbkeys = await queryProblemsetKeys()
    let dbsize = dbkeys.length;
    let querykeys = new Set()

    if (limit > dbsize) {
        limit = dbsize
    }

    // 随机取题目
    while (querykeys.size < limit) {
        let random = Math.round(Math.random() * (dbsize - 1))
        let id = dbkeys[random];
        querykeys.add(id);
    }
    console.log("数据库所有 keys", dbkeys)
    console.log("获取随机题目", querykeys)
    let sql = []
    for (let i of querykeys) {
        sql.push(['hgetall', i])
    }
    return redis.pipeline(sql).exec();
}

// 往数据库中添加题目
async function addSQLProblemset(probmemset) {
    // 生成问题 id ，id为已有题目数量+1
    let dbsize = await queryProblemsetSize()
    let id = (dbsize).toString();

    // 生成sql语句
    let sql = [['hset', id, 'id', id]]
    let keys = Object.keys(probmemset);
    for (let k of keys) {
        sql.push(['hset', id, k, probmemset[k]])
    }

    console.log(sql)
    return redis.pipeline(sql).exec()
}

// problemset分路由

// 获取题目
router.get('/get', async (ctx, next) => {
    // 获取请求题目数量
    let limit = ctx.request.query['limit'] || 8;

    let problemset = await QueryProblemset(limit);

    // 整理数据
    let arrangeProblemset = []
    for (let item of problemset) {
        arrangeProblemset.push(item[1])
    }

    ctx.body = JSON.stringify(arrangeProblemset);

});

// 添加题目
router.post("/add", async (ctx, next) => {
    let newProblemset = ctx.request.body
    await addSQLProblemset(newProblemset);
    ctx.body = message.success;
})


module.exports = router;