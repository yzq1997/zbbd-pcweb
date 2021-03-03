var pubFun = {
  setCookie: function (name, value, time) {
    var strsec = pubFun.getsec(time);
    var exp = new Date();
    exp.setTime(exp.getTime() + strsec * 1);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
  },
  getsec: function (str) {
    var str1 = str.substring(1, str.length) * 1;
    var str2 = str.substring(0, 1);
    if (str2 == "s") {
      return str1 * 1000;
    } else if (str2 == "h") {
      return str1 * 60 * 60 * 1000;
    } else if (str2 == "d") {
      return str1 * 24 * 60 * 60 * 1000;
    }
  },
  getCookie: function (name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg)) return unescape(arr[2]);
    else return null;
  },
  delCookie: function (name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = pubFun.getCookie(name);
    if (cval != null) document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
  },
  /**
   * 去掉html格式
   * @param {内容}} str 
   */
  delHtmlTag: function (str) {
    return str.replace(/<[^>]+>/g, "");
  },

  // 微信分享公用方法, 所有的需要分享的页面都会调用
  // weiXinShare: function (appID, wxData) {
  //   let wxDataRsps = {
  //     appId: appID,
  //     timestamp: parseInt((new Date()).getTime() / 1000, 0),
  //     nonceStr: createNonceStr(),
  //     signature: ''
  //   }
  //   let jsapi_ticket = '';
  //   axios.get('https://activity.jshcsoft.com/hlj/20191018/ashx/QuestionnaireLottery.ashx?dotype=GetTickt&appID=' + appID)
  //     .then(function (res) {
  //       jsapi_ticket = res;
  //     })

  //   wxDataRsps.signature = "jsapi_ticket=" + jsapi_ticket + '&noncestr=' + wxDataRsps.noncestr + '&timestamp=' + wxDataRsps.timestamp + '&url=' + location.href;

  //   wx.config({
  //     appId: wxDataRsps.appId,// 必填，公众号的唯一标识
  //     timestamp: wxDataRsps.timestamp, // 必填，生成签名的时间戳
  //     nonceStr: wxDataRsps.nonceStr,// 必填，生成签名的随机串
  //     signature: wxDataRsps.signature,// 必填，签名
  //     jsApiList: ["onMenuShareTimeline", 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo']// 必填，需要使用的JS接口列表
  //   });
  //   wx.ready(function () {
  //     wx.onMenuShareAppMessage({
  //       title: wxData.title,
  //       desc: wxData.desc,
  //       link: wxData.url,
  //       imgUrl: wxData.imgUrl,
  //       success: function () {

  //       },
  //       cancel: function () {

  //       }
  //     });
  //   });
  // }
}


export default pubFun