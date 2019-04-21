const UserInfoModel = {
    userName: "0",
    uid: "0",
    score: "0",
    avatarURL: "0",
}

// 创建 Json对象
function createJSONUserInfo(data) {
    return JSON.stringify(data);

}

//创建数据库对象
function createNewUserInfo(userName) {
    let newUser = JSON.parse(JSON.stringify(UserInfoModel));
    newUser.userName = userName;
    return newUser;
}

function createUpdateUserInfo(olddata, postdata) {
    let keys = Object.keys(UserInfoModel)
    for (let i of keys) {
        if (!!postdata[i]) {
            olddata[i] = postdata[i];
        }
    }
    return olddata;
}


module.exports = { createJSONUserInfo, createNewUserInfo, createUpdateUserInfo };