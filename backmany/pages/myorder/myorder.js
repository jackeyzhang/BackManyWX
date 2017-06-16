var util = require('../../utils/util.js')

Page({
  onLoad: function (options) {
   //do nothing
  },

  onShow: function (options) {
    var userid = wx.getStorageSync("userid");
    // loading orders
    util.request('/order/wxlistorders?user=' + userid, null, this.sucessprocess, null, null, 'GET');
  },

  sucessprocess: function (res) {
    this.setData({ orders: res.data.rows });
  }


})