// pages/answer/answer.js
const app = getApp()
const api = require("../../api/index.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    timer: 5,
    //题目数量
    limit: 8,
    isStart: false,
    isInGame: false,
    inFinish: false,
    uid: 0,
    userName: "",

    // 存放socket
    socketTask: null,

    // 头像路径
    enemyAvatarUrl: "../../assets/img/someone.jpg",
    enemyName: "搜索中..",
    enemyAddress: "",

    //分数统计 
    leftScore: 0,
    rightScore: 0,

    // 题目
    local: 1, //回答题目的数量
    localProblem: null,
    problemset: null,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {

    this.setData({
      userName: app.globalData.userInfo.userName,
      uid: app.globalData.userInfo.uid,

    })
    // 进行socket连接
    this.createSocket();

  },

  onShow: function () {

  },
  onUnload: function () {
    this.data.socketTask.close();
  },
  // 减少时间
  reduceTime() {
    setTimeout(() => {
      if (this.data.timer > 0) {
        this.setData({
          timer: this.data.timer - 1
        })
        this.reduceTime()
      } else {
        this.setData({
          timer: 6
        })
        this.changeLocalProblem()
      }

    }, 1000)
  },

  // 连接socket
  createSocket: function () {
    // 连接socket
    //this.socketTask = 
    let socket = wx.connectSocket({
      url: `ws://${api.host}:3000`,
      header: {
        'content-type': 'application/json'
      },
      protocols: ['protocol1']
    })
    //建立socket成功
    wx.onSocketOpen(() => {
      console.log('websocket连接成功!');
      this.setData({
        socketTask: socket,
      })
      //发送用户信息，等待对战
      this.socketSendUserInfo()

    })

    //连接失败
    wx.onSocketError(() => {
      console.log('websocket连接失败！');
    })

    // 接受到服务端的信息
    wx.onSocketMessage((res) => {

      console.log("接受到服务器的消息事件", res.data);
      let obj = JSON.parse(res.data);
      switch (obj.code) {
        // 0表示关闭
        case "0":
          wx.close();
          wx.reLanch({
            url: 'page/index/index'
          })
          break;

        // 200 表示匹配用户信息
        case "200":
          console.log("成功匹配到", obj);
          this.setData({
            enemyAvatarUrl: obj.avatarUrl,
            enemyName: obj.userName,
            enemyAddress: obj.address,
          })
          break;
        // 300 表示发送题目
        case "300":
          this.setData({
            problemset: obj.problemset,
            localProblem: obj.problemset[0],
            isStart: true,
            isInGame: true,
            limit: obj.problemset.length,
          })
          this.reduceTime()
          break;

        // 400 表示同步分数
        case "400":
          if (obj.userName == this.data.enemyName) {
            console.log("成功更新对方数据")
            this.setData({
              rightScore: obj.score,
            })
          }

      }

    })
    // socket连接关闭
    wx.onSocketClose(() => {
      console.log("WebSocket 断开连接")
    })
  },

  // 发送用户信息
  socketSendUserInfo: function () {
    wx.sendSocketMessage({
      data: JSON.stringify({
        "message": "await start game",
        "code": "100",
        "uid": `${app.globalData.userInfo.uid}`,
        "userName": `${app.globalData.userInfo.userName}`,
        "avatarUrl": `${app.globalData.userInfo.avatarUrl}`,
      }),
      success: () => { }
    })
  },

  //回答问题
  reply(event) {
    let rep = event.currentTarget.dataset.answer;
    if (rep == this.data.localProblem.solution) {
      this.setData({
        leftScore: this.data.leftScore + 10 + this.data.timer
      })
    } else {

      // 选错扣分，最少0分
      if (this.data.leftScore >= 5) {
        this.setData({
          leftScore: this.data.leftScore - 5
        })
      }
    }
    // 发送本次分数结果
    this.data.socketTask.send({
      data: JSON.stringify({
        code: "400",
        uid: this.data.uid,
        userName: this.data.userName,
        // address: this.data.enemyAddress,
        score: this.data.leftScore,
      })
    })
    // 切换题目
    this.changeLocalProblem();
  },

  changeLocalProblem() {
    // 超出题目数量则退出并提交成绩
    if (this.data.local >= this.data.limit) {
      this.setData({
        isInGame: false,
        inFinish: true,
      })

      // 提交分数
      api.updateServiceUserInfo(app.globalData.userInfo.userName, {
        score: (this.data.leftScore + app.globalData.userInfo.score).toString()
      });

      setTimeout(() => {
        wx.navigateBack({
          delta: this.data.leftScore + app.globalData.userInfo.score
        })
      }, 2000)
      return
    }
    this.setData({
      localProblem: this.data.problemset[this.data.local],
      local: this.data.local + 1
    })
    this.reduceTime()
  },

})