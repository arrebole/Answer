const Router = require('koa-router');
const Sign = require("../sign");
const RedisClient = require("../db");
const router = new Router();


// redis客户端
const problemsetDB = RedisClient.getTable(1);
const problemsetIDDB = RedisClient.getTable(6);
const auditProblemsetDB = RedisClient.getTable(4);

// 获取数据库中一共有多少题目 返回 number类型
async function queryProblemsetAllSize() {
    let dbsize1 = await problemsetDB.dbsize();
    let dbsize2 = await auditProblemsetDB.dbsize();
    return dbsize1 + dbsize2;
}

async function queryProblemsetNextId() {
    let localId = await problemsetIDDB.get("total");
    if (localId == null) {
        await problemsetIDDB.set("total", 0);
    }
    return (await problemsetIDDB.get("total")) + 1;
}

async function problemsetNextIdIncrease() {
    let localId = await problemsetIDDB.get("total");
    if (localId == null) {
        await problemsetIDDB.set("total", 0);
        return;
    }
    await problemsetIDDB.incr("total");
}


// 获取数据库中所有题目的id 返回 Array类型
async function queryProblemsetKeys() {
    let keys = await problemsetDB.keys("*")
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
    return problemsetDB.pipeline(sql).exec();
}

// 获取所有题目
async function QueryAllProblemset() {
    let dbkeys = await queryProblemsetKeys()
    let sql = []
    for (let i of dbkeys) {
        sql.push(['hgetall', i])
    }
    return problemsetDB.pipeline(sql).exec();
}


// 往审核数据库中添加题目
async function addSQLProblemset(probmemset) {
    // 生成问题 id ，id为已有题目数量+1
    let dbId = await queryProblemsetNextId()
    await problemsetNextIdIncrease();

    let id = (dbId).toString();

    // 生成sql语句
    let sql = [['hset', id, 'id', id]]
    let keys = Object.keys(probmemset);
    for (let k of keys) {
        sql.push(['hset', id, k, probmemset[k]])
    }
    return auditProblemsetDB.pipeline(sql).exec()
}

// problemset分路由

// 获取题目
router.get('/get', async (ctx, next) => {
    // 获取请求题目数量
    let limit = ctx.request.query['limit'] || 8;
    let problemset;

    if (limit == "all") {
        console.log("获取全部题目")
        problemset = await QueryAllProblemset();

    } else {
        problemset = await QueryProblemset(limit);
    }


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
    console.log("添加审核题目")
    console.log(newProblemset);
    await addSQLProblemset(newProblemset);
    ctx.body = Sign.success;
})

//删除题目
router.get("/delete/:id", async (ctx, next) => {
    // 获取需要删除的题目id
    let id = ctx.params["id"];
    await problemsetDB.del(id);
    ctx.body = Sign.success;
})

// 获取需要审核的列表
router.get("/audit", async (ctx, next) => {
    let allkey = await auditProblemsetDB.keys("*");
    let sql = []
    for (let key of allkey) {
        sql.push(["hgetall", key])
    }
    let list = await auditProblemsetDB.pipeline(sql).exec();
    let newList = []
    for (let item of list) {
        newList.push(item[1])
    }
    ctx.body = JSON.stringify(newList)
})
// 提交审核成功
router.get("/audit/:id", async (ctx, next) => {
    let id = ctx.params["id"];
    let sig = await auditProblemsetDB.exists(id);
    if (sig == 0) {
        ctx.body = Sign.error;
        return;
    }

    await auditProblemsetDB.move(id, 1);
    ctx.body = Sign.success;
})

module.exports = router;