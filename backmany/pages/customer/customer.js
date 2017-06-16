var util = require('../../utils/util.js')

// customer.js
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

  },

  wxlistallcustomerssucessprocess: function (res) {
    var customers = [];
    var i = 0;
    for (var data in res.data) {
      customers[i++] = {
        name: res.data[data].name,
        company: res.data[data].company,
        id: res.data[data].id
      };
    }
    this.setData({ "customers": customers });
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
    // loading customers
    util.request('/customer/wxlistallcustomers', null, this.wxlistallcustomerssucessprocess, null, null, 'GET');
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

  searchcustomerevent: function (event){
    var customer = event.detail.value;
    util.request('/customer/wxsearchcustomer?name=' + customer, null, this.wxlistallcustomerssucessprocess, null, null, 'GET');
  },

  addcustomer: function(){
    wx.navigateTo({
      url: '../customer/addcustomer/addcustomer'
    });
  },

  editcustomer:function(event){
    var customerid = event.currentTarget.dataset.customerid;
    wx.navigateTo({
      url: '../customer/editcustomer/editcustomer?id=' + customerid
    });
  }
})