// 从服务器获取分数
function getUserScore(id) {
  return new Promise((resolve, reject) => {
    wx.request({
      method: "GET",
      url: `https://localhost/api/user/info/${id}`,
      success: function(res) {
        resolve(res.data.score)
      }
    })
  })

}

// 从服务器获取题目
function getQuestions(difficult, limit) {
  return new Promise((resolve, reject) => {
    wx.request({
      method: "GET",
      url: `https://localhost/api/questions?difficult=${difficult}&limit=${limit}`,
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
      url: 'https://localhost/api/user/submit',
      dataType: 'json',
      data: {
        'uid': uid,
        'score': score
      },
      success: function(res) {
        resolve(res)
      }
    })
  })
}

module.exports = {
  'getUserScore': getUserScore,
  'getQuestions': getQuestions,
  'postScore':postScore
}