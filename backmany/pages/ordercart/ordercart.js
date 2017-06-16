var util = require('../../utils/util.js')

Page({
  onLoad: function (options) {
    // loading customers
    util.request('/customer/wxlistallcustomers', null, this.wxlistallcustomerssucessprocess, null, null, 'GET');
    // loading contracts
    util.request('/contract/wxlistallcontracts', null, this.wxlistallcontractssucessprocess, null, null, 'GET');
    // loading payment types
    var currentdate = new Date();
    var deliverydate = currentdate.getFullYear() + "-" + (currentdate.getMonth()+1) + "-" + currentdate.getDate();
    this.setData(
       {
        paymenttypes: [
          { name: '现金', value: '6', checked: 'true' },
          { name: '网银', value: '1' },
          { name: '微信', value: '2' },
          { name: '借记卡', value: '5' },
          { name: '支票', value: '7' },
        ],
        deliverydate: deliverydate,
        paymenttype:6,//现金
        displaycheckout:true
       }
    );
  },

  onShow: function (options) {
    // loading customers
    util.request('/customer/wxlistallcustomers', null, this.wxlistallcustomerssucessprocess, null, null, 'GET');
    this.freshUI();
  },

  paymenttypeChange: function (e) {
    this.setData( {paymenttype : e.detail.value });
  },

  wxlistallcustomerssucessprocess: function (res) {
    var customers = [];
    var customerids = [];
    var i=0;
    for (var data in res.data){
      customers[i] = res.data[data].name + "-" + res.data[data].company;
      customerids[i++] = res.data[data].id;
    }
    this.setData({ "customers": customers, "customerids": customerids, "customerindex": 0 });
  },

  wxlistallcontractssucessprocess:function( res ){
    var contracts = [];
    var contractids = [];
    var i = 0;
    for (var data in res.data) {
      contracts[i] = res.data[data].name;
      contractids[i++] = res.data[data].id;
    }
    this.setData({ "contracts": contracts, "contractids": contractids, "contractindex": 0 });
  },

  freshUI: function () {
    try {
      var res = wx.getStorageInfoSync();
      var orderitems = [];
      var i = 0;
      var totalprice = 0;
      var totaldiscount = wx.getStorageSync("totaldiscount");
      for (var pk in res.keys) {
        var kk = res.keys[pk];
        if (kk.indexOf("oi-") < 0) continue;
        orderitems[i++] = wx.getStorageSync(kk);
        totalprice += wx.getStorageSync(kk).totalprice;
      }
      var totalpricetopay = totalprice * totaldiscount / 100;
      var totalcomments = wx.getStorageSync("totalcomments");
      this.setData({
        orderitems: orderitems,
        totalprice: totalprice,
        totalpricetopay: totalpricetopay,
        totaldiscount: totaldiscount,
        totalcomments: totalcomments,
        paid: totalpricetopay
      });
    } catch (e) {
    }
  },

  clearordercart: function () {
    var that = this;
    wx.showModal({
      title: '清空购物车',
      content: '是否确认清空购物车?',
      success: function (res) {
        if (res.confirm) {
          wx.clearStorageSync();
          that.freshUI();
        }
      }
    });
  },

  submitordercart: function () {
    var that = this;
    var userid = wx.getStorageSync("userid");
    wx.showModal({
      title: '提交订单',
      content: '是否确认提交购物车?',
      success: function (res) {
        if (res.confirm) {
          var orderitems = that.data.orderitems;
          var submitdata = {
            orderitems: orderitems,
            totalprice: that.data.totalprice,
            totaldiscount: that.data.totaldiscount,
            totalpricetopay: that.data.totalpricetopay,
            totalcomments: that.data.totalcomments,
            paymenttype: that.data.paymenttype,
            deliverydate: that.data.deliverydate,
            customerid: that.data.customerids[that.data.customerindex],
            ispay: that.data.displaycheckout,
            paid:that.data.paid,
            userid: userid,
            contractid: that.data.contractids[that.data.contractindex]
          };
          util.request('/order/wxsubmitorder', submitdata, that.processaftersucessful, null);
        }
      }
    });
  },

  processaftersucessful: function () {
    //clear order cart info
    var res = wx.getStorageInfoSync();
    for (var pk in res.keys) {
      var kk = res.keys[pk];
      if (kk.indexOf("oi-") < 0 && kk.indexOf("total") < 0) continue;
      wx.removeStorageSync(kk);
    }
    this.freshUI();
  },

  minus: function (event) {
    var that = this;
    var orderitemkey = event.currentTarget.dataset.key;
    var orderitem = wx.getStorageSync(orderitemkey);
    if (orderitem) {
      orderitem.count = orderitem.count - 1;
      if (orderitem.count == 0) {
        wx.showModal({
          title: '确认从购物车删除该商品',
          content: '是否确认删除该商品?',
          success: function (res) {
            if (res.confirm) {
              wx.removeStorageSync(orderitemkey);
              that.freshUI();
            }
          }
        });
      } else {
        orderitem.totalprice = orderitem.price * orderitem.count * orderitem.discount / 100 + parseFloat(orderitem.afee);
        wx.setStorageSync(orderitemkey, orderitem);
        this.freshUI();
      }

    }
  },

  add: function (event) {
    var orderitemkey = event.currentTarget.dataset.key;
    var orderitem = wx.getStorageSync(orderitemkey);
    if (orderitem) {
      orderitem.count = orderitem.count + 1;
      orderitem.totalprice = orderitem.price * orderitem.count * orderitem.discount / 100 + parseFloat(orderitem.afee);
      wx.setStorageSync(orderitemkey, orderitem);
      this.freshUI();
    }
  },

  binddiscount: function (event) {
    var discount = event.detail.value;
    var orderitemkey = event.currentTarget.dataset.key;
    var orderitem = wx.getStorageSync(orderitemkey);
    if (orderitem) {
      orderitem.discount = discount;
      orderitem.totalprice = orderitem.price * orderitem.count * discount / 100 + parseFloat(orderitem.afee);
      wx.setStorageSync(orderitemkey, orderitem);
      this.freshUI();
    }
  },

  bindtotaldiscount: function (event) {
    var discount = event.detail.value;
    wx.setStorageSync("totaldiscount", discount);
    this.freshUI();

  },

  bindtotalcomment: function (event) {
    var totalcomments = event.detail.value;
    wx.setStorageSync("totalcomments", totalcomments);
    this.freshUI();
  },

  bindcomments: function (event) {
    var comments = event.detail.value;
    var orderitemkey = event.currentTarget.dataset.key;
    var orderitem = wx.getStorageSync(orderitemkey);
    if (orderitem) {
      orderitem.comments = comments;
      wx.setStorageSync(orderitemkey, orderitem);
      this.freshUI();
    }
  },

  bindDateChange:function( e ){
    this.setData({
      deliverydate: e.detail.value
    })
  },

  bindCustomerChange:function( e) {
    this.setData({
      customerindex: e.detail.value
    })
  },

  bindContractChange: function(e){
    this.setData({
      contractindex: e.detail.value
    })
  },

  checkoutchange:function( e ){
    this.setData({
      displaycheckout: e.detail.value
    })
  },

  bindpaid: function(e){
    this.setData({
      paid: e.detail.value
    })
  },

  bindadditionfee: function (event ){
    var afee = event.detail.value;
    var orderitemkey = event.currentTarget.dataset.key;
    var orderitem = wx.getStorageSync(orderitemkey);
    if (orderitem) {
      orderitem.afee = afee;
      orderitem.totalprice = orderitem.price * orderitem.count * orderitem.discount / 100 + parseFloat(orderitem.afee);
      wx.setStorageSync(orderitemkey, orderitem);
      this.freshUI();
    }
  },

  bindAddCustomer: function( ){
    wx.navigateTo({
      url: '../customer/addcustomer/addcustomer?backtoordercart=yes'
    });
  }

})