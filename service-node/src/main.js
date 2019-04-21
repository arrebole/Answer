const Koa = require('koa');
const router = require("./route/index");
const bodyParser = require('koa-bodyparser');

// 实例化服务器
const app = new Koa();


app
    .use(bodyParser())
    .use(router.routes())
    .use(router.allowedMethods());


console.log("服务器启动 http://127.0.0.1:8080")
app.listen(8080);// 监听端口