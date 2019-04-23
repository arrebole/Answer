const Router = require('koa-router');
const Sign = require("../sign");
const RedisClients = require("../db");
const historyDB = RedisClients.getTable(5);


const router = new Router(); // 路由中间件
router.get("/:userName", async (ctx, next) => {
    let userName = ctx.params["userName"];
    let history = await historyDB.hgetall(userName)
    console.log(history)
    ctx.body = JSON.stringify(history);
})


module.exports = router;