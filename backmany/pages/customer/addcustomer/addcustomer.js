var util = require('../../../utils/util.js')
// addcustomer.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var backtoordercart = options.backtoordercart;
    if ( backtoordercart ){
      this.setData({
        backtoordercart : true
      });
    }
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

  },

  /**
   * 提交客户信息
   */
  customersubmit: function (event) {
    console.log(event.detail.value);
    var value = event.detail.value;
    util.request('/customer/wxaddcustomer', value, this.successprocess, this.failprocess);
  },

  successprocess: function (res) {
    var that = this;
    // success
    if (res.data) {
      wx.switchTab({
        url: that.data.backtoordercart? '../../ordercart/ordercart' :  '../customer',
        success: function (res) {
          wx.showToast({
            title: '客户信息已提交',
            icon: 'success',
            duration: 2000
          });
        },
        fail: function () {
          console.log('failed');
        },
        complete: function () {
          // complete
        }
      });
    }
  },

  failprocess: function (res) {
    // success
    if (res.data) {
      wx.showToast({
        title: '客户信息提交失败',
        icon: 'success',
        duration: 2000
      })
    }
  }
})