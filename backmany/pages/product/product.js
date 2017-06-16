var util = require('../../utils/util.js')

Page({

  onLoad: function (options) {
    var productid = options.id;
    util.request('/product/wxgetproduct?prdid=' + productid, null, this.sucessprocess, null, null, 'GET');
  },

  bindcomments: function( e ){
    this.setData({
      comments: e.detail.value
    })
  },

  addtoordercart: function (event) {
    var productid = event.currentTarget.dataset.productid;
    var productname = event.currentTarget.dataset.productname;
    var filename = event.currentTarget.dataset.filename;
    var index = this.data.index;
    var price = this.data.data.prices[index];
    var comments = this.data.comments || "";
    var orderitemkey = "oi-" + productid + "-" + price.id;
    var orderitemcount = 1;
    var orderitem = wx.getStorageSync(orderitemkey);
    if (orderitem) {
      orderitemcount = orderitem.count + 1;
    }
    try {
      wx.setStorage({
        key: orderitemkey,
        data: {
          productname: productname,
          productid: productid,
          filename: filename,
          priceid: price.id,
          attributes: price.pricekey,
          count: orderitemcount,
          price: price.price,
          totalprice: price.price * orderitemcount,
          discount: 100,
          comments: comments,
          afee:0
        }
      });
      if (!wx.getStorageSync('totaldiscount')) {
        wx.setStorage({
          key: 'totaldiscount',
          data: 100,
        });
      }

      wx.showToast({
        title: '加入购物车成功',
        icon: 'success',
        duration: 2000
      });
    } catch (e) {
    }
  },

  sucessprocess: function (res) {
    this.setData({ "data": res.data, "price": res.data.prices[0], "index": 0 });
  },

  choseprice: function (event) {
    var index = event.currentTarget.dataset.priceindex;
    var price = this.data.data.prices[index];
    this.setData({ "price": price, "index": index });
  }

})