function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

var host = "https://backmany.yeeist.com";
// var host = "http://localhost:8088"
//"https://backmany.yeeist.com";//"http://localhost:8088"//"http://139.196.255.213";

function request(url,postData,doSuccess,doFail,doComplete,method){
   wx.request({
    url: host+url,
    data:postData,
    method: method? "POST" : method,
    header: { 'content-type': method ? 'application/json': 'application/x-www-form-urlencoded' },
    success: function(res){
     if(typeof doSuccess == "function"){
       doSuccess(res);
     }
    },
    fail: function() {
     if(typeof doFail == "function"){
       doFail();
     }
    },
    complete: function() {
     if(typeof doComplete == "function"){
       doComplete();
     }
    }
   });
}


module.exports = {
  formatTime: formatTime,
  api_url:host,
  request:request
}
