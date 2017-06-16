var util = require('../../utils/util.js')

Page({
    data: {

    },

    onLoad: function () {
        this.getProductList();
    },


    searchproductevent: function (event) {
        var searchtext = event.detail.value;
        util.request('/product/wxsearchlist?searchtext=' + searchtext, null, this.sucessprocess, null, null, 'GET');
    },

    onProductTap: function (event) {
        var productid = event.currentTarget.dataset.productid;
        wx.navigateTo({
            url: '../product/product?id=' + productid
        })
    },

    sucessprocess: function (res) {
        this.setData({ products: res.data.rows });
    },


    getProductList: function () {
        var that = this;
        util.request('/product/wxlist', null, this.sucessprocess, null, null, 'GET');
    },

    buyprocess: function (event) {
        var productid = event.currentTarget.dataset.productid;
        wx.navigateTo({
            url: '../product/product?id=' + productid
        });
    },

    scansuccess: function (prdid) {
        wx.navigateTo({
            url: '../product/product?id=' + prdid
        });
    },

    scanproduct: function () {
        var that = this;
        wx.scanCode({
            success: (res) => {
                var scanresult = res.result;
                if (scanresult == '') {
                    wx.showToast({
                        title: '扫描失败',
                        icon: 'warn',
                        duration: 2000
                    });
                    return;
                }
                var index = scanresult.indexOf("=");
                var productid = scanresult.substring(index+1);
                that.scansuccess( productid );
            },
            complete: function (res) {
                console.log("scan complete");
            },
            fail: function (res) {
                console.log("scan failed");
            }
        })
    }
}
)