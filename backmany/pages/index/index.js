var util = require('../../utils/util.js')
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: '请输入贝可曼尼账号',
    userInfo: {},
    swiperimgs: [
      util.api_url + "/img/3.jpg",
      util.api_url + "/img/2.jpg",
      util.api_url + "/img/1.jpg"]
  },
  //事件处理函数
  bindViewTap: function () {
    wx.switchTab({
      url: '../homepage/homepage',
      success: function (res) {
        // success
      },
      fail: function () {
        console.log('failed');
      },
      complete: function () {
        // complete
      }
    })
  },
  onLoad: function () {
    console.log('onLoad');
  },

  successprocess: function (res) {
    // success
    if (res.data) {
      var userid = res.data.id;
      wx.setStorageSync("userid",userid);
      wx.switchTab({
        url: '../homepage/homepage',
        success: function (res) {
          // success
        },
        fail: function () {
          console.log('failed');
        },
        complete: function () {
          // complete
        }
      });
    } else {
      wx.showToast({
        title: '用户名密码错误',
        icon: 'success',
        duration: 2000
      })
    }
  },

  failprocess: function () {
    wx.removeStorageSync("userid");
    wx.showToast({
      title: '服务器连接错误',
      icon: 'success',
      duration: 2000
    })
  },

  loginSubmit: function (event) {
    var value = event.detail.value;
    if (value.user == "" || value.password == "") {
      wx.showToast({
        title: '用户名密码不能为空',
        icon: 'success',
        duration: 2000
      })
      return;
    }
    util.request('/login/wxlogin', value, this.successprocess, this.failprocess);
  }
})
