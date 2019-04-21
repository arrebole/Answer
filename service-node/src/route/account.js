const Router = require('koa-router');
const message = require("../utils/message");
const { db0, db2 } = require("../db");
const { createNewUserInfo, createUpdateUserInfo } = require("../utils/userInfo")



// 实例化对象
const router = new Router(); // 路由中间件
const redis = db0;




// 创建新用户数据
function HSET(User) {
    console.log(User)
    let key = User.userName;
    return redis.pipeline([
        ['hset', key, 'userName', User.userName],
        ['hset', key, 'score', User.score],
        ['hset', key, 'avatarURL', User.avatarURL],
        ['hset', key, 'uid', User.uid]
    ]).exec()
}


// account分路由

// 获取用户信息
router.get('/:userName', async (ctx, next) => {
    // 获取url的参数 userName
    // 请求路径 /account/myname 时 userName = {userName: 'myname'}
    let userName = ctx.params["userName"];

    let userInfo = await redis.hgetall(userName);
    // 如果不存在数据则创建用户
    if (Object.keys(userInfo).length <= 1) {
        console.log("不存在的账户，正在创建 %s...", userName)
        await HSET(createNewUserInfo(userName))

        userInfo = await redis.hgetall(userName);
    }
    // 返回并序列化数据
    ctx.body = JSON.stringify(userInfo);

});

// 提交用户信息
router.post('/:userName', async (ctx, next) => {
    let userName = ctx.params["userName"];
    let postUserInfo = ctx.request.body;

    let localUserInfo = await redis.hgetall(userName);//获取旧信息
    // 如果不存在用户则返回错误
    if (Object.keys(localUserInfo).length <= 1) {
        ctx.body = message.error;
        return;
    }

    // 如果存在提交分数则同步排行榜 db
    if ( postUserInfo.hasOwnProperty("score")) {
        console.log("更新排行榜数据",userName)
        await db2.zadd("ranking",parseInt(postUserInfo["score"]),userName);
    }

    // 更新用户数据库
    HSET(createUpdateUserInfo(localUserInfo, postUserInfo))//更新旧信息
    let newUserInfo = await redis.hgetall(userName);//获取新信息


    ctx.body = JSON.stringify(newUserInfo);
})


module.exports = router;