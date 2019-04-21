

const Router = require("koa-router");
const account = require("./account");
const problemset = require("./problemset");
const ranking = require("./ranking");

const router = new Router();

// 总路由表
// 路由汇总
router
    .use("/api/account", account.routes(), account.allowedMethods())
    .use("/api/problemset", problemset.routes(), problemset.allowedMethods())
    .use("/api/ranking",ranking.routes(),ranking.allowedMethods())


module.exports = router;