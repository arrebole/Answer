// pages/giftbag/giftbag.js
const api = require("../../api/index.js");
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    giftbagCode: ""
  },

  bindKeyInput: function (e) {
    this.setData({
      giftbagCode: e.detail.value
    })
  },
  // 提交
  bindSubmit: function () {
    api.getGiftBag({
      giftbagCode: this.data.giftbagCode,
      userName: app.globalData.userInfo.userName
    }).then(() => {
      wx.navigateBack({
        delta: 2
      })
    })
  },
})