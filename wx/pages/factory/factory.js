// pages/factory/factory.js
const api = require("../../api/index.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    topic: "",
    solution: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
  },
  bindSubmit: function () {
    api.addProblemset({
      topic: this.data.topic,
      solution: this.data.solution,
      optionA: this.data.optionA,
      optionB: this.data.optionB,
      optionC: this.data.optionC,
      optionD: this.data.optionD
    }).then(() => {
      wx.navigateTo({
        url: '../index/index'
      })
    })
  },
  bindKeyInput: function (e) {
    let t = e.currentTarget.dataset.type
    this.setData({
      [t]: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {

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