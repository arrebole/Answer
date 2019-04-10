//app.js
    
// 展示本地存储能力
// var logs = wx.getStorageSync('logs') || []
// logs.unshift(Date.now())
// wx.setStorageSync('logs', logs)


App({

  onLaunch: function () {
    
  },
  globalData: {
    userInfo: {
      uid:1,
      userName:"admin",
      score:0,
    }
  }
})