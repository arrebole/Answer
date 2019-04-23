const Router = require('koa-router');
const RedisClients = require("../db");
const Sign = require("../sign");

// 实例化对象
const router = new Router(); // 路由中间件
const giftbagDB = RedisClients.getTable(3);
const accountDB = RedisClients.getTable(0);

router.post("/", async (ctx, next) => {
    let data = ctx.request.body;
    console.log(data)
    if (!data.hasOwnProperty("giftbagCode")) {
        ctx.body = Sign.error;
        return;
    }
    let flag = await giftbagDB.exists(data["giftbagCode"])
    if (flag == 0) {
        return;
    }
    let gift = await giftbagDB.get(data["giftbagCode"])
    await giftbagDB.del(data["giftbagCode"])

    let oldScore = await accountDB.hget(data["userName"], "score")
    let newScore = parseInt(gift) + parseInt(oldScore)

    await accountDB.hset(data["userName"], "score", newScore.toString())
    console.log("更新排行榜数据", userName)
    await rankingDB.zadd("ranking", newScore, data["userName"]);

    ctx.body = Sign.success;
})


module.exports = router;