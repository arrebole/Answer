//index.js
//获取应用实例
const app = getApp()
const api = require("../../api/index.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid: 0,
    score: 0
  },

  // 跳转排行榜
  gototrophy: function() {
    wx.navigateTo({
      url: '../trophy/trophy'
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    // 获取用户分数
    this.fetchData();

  },

  fetchData: function() {
    // 获取uid
    this.setData({
      uid: app.globalData.userInfo.uid
    })

    // 从后端获取分数 【异步回调】
    api.getUserScore(this.data.uid).then((res) => {
      this.setData({
        score: res
      });
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.fetchData()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})