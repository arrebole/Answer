//index.js
//获取应用实例
const app = getApp()
const api = require("../../api/index.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid: app.globalData.userInfo.uid,
    score: app.globalData.userInfo.score,
    userName: '',
    //用户是否授权
    isAuthorizar: app.globalData.userInfo.isAuthorizar,
  },

  // 跳转排行榜
  gotoAnswer: function () {
    wx.navigateTo({
      url: '../answer/answer'
    })

  },
  //gotoLeaderboard
  gotoLeaderBoard: function () {
    wx.navigateTo({
      url: '../leaderboard/leaderboard'
    })

  },
  // 跳到题目工厂
  gotoFactory: function () {
    wx.navigateTo({
      url: '../factory/factory'
    })
  },

  gotoGiftbag: function () {
    wx.navigateTo({
      url: '../giftbag/giftbag'
    })
  },

  gotoHistory:function(){
    wx.navigateTo({
      url: '../history/history'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  onShow: function () {
    if (app.globalData.userInfo.uid != '-1') {
      this.getServiceUserInfo(app.globalData.userInfo.userName);
    }
  },

  // 获取微信用户信息
  bindGetWXUserInfo: function (e) {
    this.setData({
      isAuthorizar: true
    })
    app.globalData.userInfo.userName = e.detail.userInfo.nickName;
    app.globalData.userInfo.avatarUrl = e.detail.userInfo.avatarUrl;
    app.globalData.userInfo.isAuthorizar = true;
    this.getServiceUserInfo(e.detail.userInfo.nickName);
  },

  // 通过微信昵称 获取后端用户信息
  getServiceUserInfo(userName) {

    let getinfo = api.getServiceUserInfo(userName);
    getinfo.then((res) => {
      console.log("获取后端用户信息成功为", res);

      // 设置全局数据
      app.globalData.userInfo.score = parseInt(res.score);
      app.globalData.userInfo.uid = res.uid;
      app.userName = res.userName;

      // 更新后端数据(头像)
      api.updateServiceUserInfo(
        app.globalData.userInfo.userName, {
          "avatarURL": app.globalData.userInfo.avatarUrl
        }).then((res) => { console.log("更新后端用户信息成功为", res) })

      // 从app全局数据同步本页数据
      this.refreshData();
    })

  },

  // 从全局数据同步本页数据
  refreshData() {
    this.setData({
      uid: app.globalData.userInfo.uid,
      score: app.globalData.userInfo.score,
    })
  }

})