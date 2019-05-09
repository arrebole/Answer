const Router = require('koa-router');
const Sign = require("../sign");
const RedisClients = require("../db");
const chinaTime = require('china-time');
const { createNewUserInfo, createUpdateUserInfo } = require("../utils/userInfo")



// 实例化对象
const router = new Router(); // 路由中间件
const accountDB = RedisClients.getTable(0);
const rankingDB = RedisClients.getTable(2);
const historyDB = RedisClients.getTable(5);

// 更新用户数据
async function HsetUserAll(User, db) {
    let key = User.userName;
    let uid = await db.dbsize();
    User.uid = uid.toString()
    console.log("更新用户数据", User)
    return db.pipeline([
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

    let userInfo = await accountDB.hgetall(userName);
    // 如果不存在数据则创建用户
    if (Object.keys(userInfo).length <= 1) {
        console.log("不存在的账户，正在创建 %s...", userName)
        await HsetUserAll(createNewUserInfo(userName), accountDB)

        userInfo = await accountDB.hgetall(userName);
    }
    // 返回并序列化数据
    ctx.body = JSON.stringify(userInfo);

});

// 提交用户信息
router.post('/:userName', async (ctx, next) => {
    let userName = ctx.params["userName"];
    let postUserInfo = ctx.request.body;

    let localUserInfo = await accountDB.hgetall(userName);//获取旧信息
    // 如果不存在用户则返回错误
    if (Object.keys(localUserInfo).length <= 1) {
        ctx.body = Sign.error;
        return;
    }

    // 如果存在提交分数则同步排行榜 db
    if (postUserInfo.hasOwnProperty("score") && postUserInfo["score"] != "0") {
        console.log("更新排行榜数据", userName)
        await rankingDB.zadd("ranking", parseInt(postUserInfo["score"]), userName);
        console.log("更新历史记录", userName)
        let c = parseInt(postUserInfo["score"]) - parseInt(localUserInfo["score"])
        if (c > 0) {
            await historyDB.hset(userName, chinaTime('YYYY-MM-DD HH:mm:ss'), c.toString());
        }

    }

    // 更新用户数据库
    let newUserInfo = null;
    if (postUserInfo["score"] != "0") {
        await HsetUserAll(createUpdateUserInfo(localUserInfo, postUserInfo), accountDB)//更新旧信息
        newUserInfo = await accountDB.hgetall(userName);//获取新信息
    }

    // 返回更新后的用户数据
    ctx.body = JSON.stringify(newUserInfo);
})


module.exports = router;