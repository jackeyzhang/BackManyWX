var util = require('../../../utils/util.js')
// editcustomer.js
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
    var customerid = options.id;
    util.request('/customer/wxgetcustomer?id=' + customerid, null, this.successprocess, null, null, 'GET');
  },

  successprocess: function (res) {
    if (res.data) {
      this.setData(res.data);
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
   * 删除客户
   */
  deletecustomer: function (event) {
    var deletecustomerid = event.currentTarget.dataset.customerid;
    var that = this;
    wx.showModal({
      title: '删除该客户',
      content: '是否确认删除?',
      success: function (res) {
        if (res.confirm) {
          util.request('/customer/wxdeletecustomer?id=' + deletecustomerid, null, that.delsuccessprocess, null, null, 'GET');
        }
      }
    });

  },

  delsuccessprocess: function (res) {
    // success
    if (res.data) {
      wx.switchTab({
        url: '../customer',
        success: function (res) {
          wx.showToast({
            title: '客户信息已删除',
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

  /**
   * edit customer
   */
  customersubmit: function (event) {
    var value = event.detail.value;
    util.request('/customer/wxupdatecustomer', value, this.cssuccessprocess, this.csfailprocess);
  },

  cssuccessprocess: function (res) {
    // success
    if (res.data) {
      wx.switchTab({
        url: '../customer',
        success: function (res) {
          wx.showToast({
            title: '客户信息已修改',
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

  csfailprocess: function (res) {
    // success
    wx.showToast({
      title: '客户信息提交失败',
      icon: 'success',
      duration: 2000
    });
  }
})