// pages/history.js
const api = require("../../api/index.js");
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    history: [],
    isLoading: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    api.getHistory(app.globalData.userInfo.userName).then((res) => {

      let list = [];
      for (let index in res) {
        list.unshift({
          time: index,
          score: res[index]
        })
      }
      console.log("获取历史记录", list)
      this.setData({
        history: list,
        isLoading: false,
      })
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})