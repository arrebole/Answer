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
    userName:'',
    //用户是否授权
    isAuthorizar: false,
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
  },

  onShow:function(){
    if (app.globalData.userInfo.uid != 0) {
      this.getServiceUserInfo(app.globalData.userInfo.userName);
    }
  },

  // 获取微信用户信息
  bindGetWXUserInfo: function(e){
    this.setData({
      isAuthorizar : true
    })
    app.globalData.userInfo.userName = e.detail.userInfo.nickName;
    app.globalData.userInfo.avatarUrl = e.detail.userInfo.avatarUrl;
    this.getServiceUserInfo(e.detail.userInfo.nickName);
  },

  // 通过微信昵称 获取后端用户信息
  getServiceUserInfo(userName){
    
    let getinfo = api.getServiceUserInfo(userName);
    getinfo.then((res)=>{
      
      app.globalData.userInfo.score = res.score;
      app.globalData.userInfo.uid = res.uid;
      app.userName = res.userName;
      this.refreshData();
    })
    
  },

  // 同步页面数据
  refreshData(){
    this.setData({
      uid:app.globalData.userInfo.uid,
      score:app.globalData.userInfo.score,
    })
  }
  
})