const Router = require('koa-router');
const RedisClients = require("../db");
const router = new Router();

const rankingDB = RedisClients.getTable(2);
const accountDB = RedisClients.getTable(0);


// 读取前20用户
function QueyUserBySore(limit) {
    return  rankingDB.zrevrange("ranking", 0, limit)
}

// 通过用户生成sql语句
function createSqlString(list) {
    let sql = [];
    for (let item of list) {
        sql.push(['hgetall', item])
    }
    return sql;
}

// 整理数据
function organizeData(list) {
    let array = []
    for (let item of list) {
        array.push(item[1]);
    }
    return array;
}


// 请求 /api/rangking 获取排行榜
router.get("/", async (ctx, next) => {
    let rangking = await QueyUserBySore(20);
    let sql = createSqlString(rangking)
    let rangkingUserData = await accountDB.pipeline(sql).exec();
    ctx.body =  JSON.stringify(organizeData(rangkingUserData))
})


module.exports = router;


