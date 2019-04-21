const Router = require('koa-router');
const { db2, db0 } = require("../db");
const router = new Router();


// 读取前20用户
function QueyUserBySore(limit) {
    return db2.zrevrange("ranking", 0, limit)
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
    let rangkingUserData = await db0.pipeline(sql).exec();
    ctx.body =  JSON.stringify(organizeData(rangkingUserData))
})


module.exports = router;


