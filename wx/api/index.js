
const host = "gkdark.xyz";

// 从服务器获取分数
function getServiceUserInfo(userName) {
  return new Promise((resolve, reject) => {
    wx.request({
      method: "GET",
      url: `https://${host}/api/account/${userName}`,
      success: function (res) {
        resolve(res.data)
      }
    })
  })

}


// 从服务器获取题目
function getQuestions(limit) {
  return new Promise((resolve, reject) => {
    wx.request({
      method: "GET",
      url: `https://${host}/api/problemset/get?limit=${limit}`,
      success: function (res) {
        resolve(res.data)
      }
    })
  })
}

// 提交成绩
function updateServiceUserInfo(uid, data) {
  return new Promise(resolve => {
    wx.request({
      method: 'POST',
      url: `https://${host}/api/account/${uid}`,
      dataType: 'json',
      data: JSON.stringify(data),
      success: function (res) {
        resolve(res.data)
      }
    })
  })
}

// 查看排行榜
function getRanking() {
  return new Promise(resolve => {
    wx.request({
      method: 'GET',
      url: `https://${host}/api/ranking`,
      dataType: 'json',
      success: function (res) {
        resolve(res.data)
      }
    })
  })
}

function addProblemset(data){
  return new Promise(resolve => {
    wx.request({
      method: 'POST',
      url: `https://${host}/api/problemset/add`,
      dataType: 'json',
      data:JSON.stringify(data),
      success: function (res) {
        resolve(res.data)
      }
    })
  })
}

function getGiftBag(data){
  return new Promise(resolve => {
    wx.request({
      method: 'POST',
      url: `https://${host}/api/giftbag`,
      dataType: 'json',
      data:JSON.stringify(data),
      success: function (res) {
        resolve(res.data)
      }
    })
  })
}

function getHistory(userName) {
  return new Promise(resolve => {
    wx.request({
      method: 'GET',
      url: `https://${host}/api/history/${userName}`,
      dataType: 'json',
      success: function (res) {
        resolve(res.data)
      }
    })
  })
}

module.exports = {
  'getServiceUserInfo': getServiceUserInfo,
  'updateServiceUserInfo': updateServiceUserInfo,
  'getQuestions': getQuestions,
  "getRanking": getRanking,
  'host': host,
  'addProblemset':addProblemset,
  'getGiftBag':getGiftBag,
  'getHistory': getHistory
}