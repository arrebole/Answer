// pages/answer/answer.js
const app = getApp()
const api = require("../../api/index.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 难度
    difficult: 0,
    limit: 8,
    isStart:true,
    isInGame: false,
    inFinish:false,
    uid: 0,

    // 头像路径
    rightAvatarUrl: '',

    //分数统计 
    leftScore: 0,
    rightScore: 0,

    // 题目
    local: 0,
    localQuestion: null,
    questions: null,

    // 样式
    aCss: "question-select-default",
    bCss: "question-select-default",
    cCss: "question-select-default",
    dCss: 'question-select-default',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    // 获取用户数据
    this.setData({
      uid: app.globalData.userInfo.uid,
      difficult: parseInt(options.difficult),
      rightAvatarUrl: "../../assets/img/someone.jpg",

    })

    // 获取题目数据
    api.getQuestions(this.data.difficult, this.data.limit).then((data) => {
      // 储存题库
      this.setData({
        questions: data
      })
      // 取出第一题
      this.changeLocalQuestion()
    })
    // show页面
    setTimeout(()=>{
      this.setData({
        isStart:false,
        isInGame:true,

      })
    },2000)

  },
  // 切换题目
  changeLocalQuestion: function() {
    // 超出题目数量则退出并提交成绩
    if (this.data.local >= this.data.limit) {
      this.setData({
        isInGame: false,
        inFinish:true,
      })
      api.postScore(this.data.uid, this.data.leftScore).then(() => {});

      setTimeout(() => {
        wx.navigateBack({
          delta: 2
        })
      }, 2000)
      return
    }
    this.setData({
      localQuestion: this.data.questions[this.data.local],
      local: this.data.local + 1
    })
  },

  // 回答问题
  reply: function(event) {

    // 我方回答
    var q = event.currentTarget.dataset.answer

    if (q == this.data.localQuestion.answer) {
      this.setData({
        leftScore: this.data.leftScore + this.data.difficult * 10
      })
    } else {

      // 选错扣分，最少0分
      if (this.data.leftScore >= this.data.difficult * 5) {
        this.setData({
          leftScore: this.data.leftScore - this.data.difficult * 5
        })
      }

    }
    // 敌方回答
    var rand = Math.round(Math.random() * 10);
    if (rand >= 5) {
      this.setData({
        rightScore: this.data.rightScore + this.data.difficult * 10
      })
    } else {
      if (this.data.rightScore >= this.data.difficult * 5) {
        this.setData({
          rightScore: this.data.rightScore - this.data.difficult * 5
        })
      }
    }



    // 切换题目
    this.changeLocalQuestion();
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