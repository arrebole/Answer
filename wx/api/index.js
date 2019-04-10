// 从服务器获取分数
function getServiceUserInfo(userName) {
  return new Promise((resolve, reject) => {
    wx.request({
      method: "GET",
      url: `https://127.0.0.1/account/${userName}`,
      success: function(res) {
        resolve(res.data)
      }
    })
  })

}


// 从服务器获取题目
function getQuestions(difficult, limit) {
  return new Promise((resolve, reject) => {
    wx.request({
      method: "GET",
      url: `https://127.0.0.1/problemset/get?level=${difficult}&limit=${limit}`,
      success: function(res) {
        resolve(res.data)
      }
    })
  })
}

// 提交成绩
function postScore(uid, score) {
  return new Promise(resolve => {
    wx.request({
      method: 'POST',
      url: `https://127.0.0.1/account/${uid}`,
      dataType: 'json',
      data: {
        'modify': score
      },
      success: function(res) {
        resolve(res)
      }
    })
  })
}

module.exports = {
  'getServiceUserInfo': getServiceUserInfo,
  'getQuestions': getQuestions,
  'postScore': postScore,
}