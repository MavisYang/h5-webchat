function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)
        return (r[2]);
    return null;
}

function isPhone(str){
    // var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
    var myreg = /^1[3-8]{1}\d{9}$/;
    if(myreg.test(str)){
        return true
    }else{
        alert("您输入的电话号码格式不正确!");
        return false;
    }

}

function dataLoad(filename) {
    var arraydata;
    $.ajax({
        type: "GET",
        url: filename,
        dataType: "json",
        async: false, //false 同步请求 true 异步请求 默认true
        success: function (json) {
            arraydata = eval(json)
        },
        error:function (json) {
            console.log(json,'fail')
        }
    });
    return arraydata;
}

function setCookie(name,value){
    document.cookie = name + "=" + escape(value) + ";expires=" + new Date(Date.now()+1*24*3600*1000);//code存cookie
}
function getCookie (name) {
    var result
    if(document.cookie!=''){
        result=new RegExp(name+'=([^;]+)').exec(document.cookie)
    }
    return result
}

function removeCookie (name) {
    document.cookie= name + '=outdate;expires=' +new Date(Date.now()-36110000)
}


function setWxShareConent(currentUrl,shareWord) {
    var url = encodeURIComponent(currentUrl);
    $.ajax({
        type:'GET',
        url:"/wx/getJssdkConfig?url=" + url,
        success:function (data) {
            wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: data.appid, // 必填，公众号的唯一标识
                timestamp: data.timestamp, // 必填，生成签名的时间戳
                nonceStr: data.nonceStr, // 必填，生成签名的随机串
                signature: data.signature,// 必填，签名，见附录1
                jsApiList: [
                    'onMenuShareAppMessage',
                    'onMenuShareTimeline',
                ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            })
        }
    })

    wx.ready(function () {
        /*发送给朋友*/
        wx.onMenuShareAppMessage({
            title: shareWord.title, // 分享标题
            desc: shareWord.desc, // 分享描述
            link: shareWord.localHref, // 分享链接
            imgUrl: shareWord.imgUrl, // 分享图标
            type: '', // 分享类型,music、video或link，不填默认为link
            dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            success: function () {
                // 用户确认分享后执行的回调函数
//                    _czc.push(["_trackEvent",'代理页分享朋友','回调','有栗聚福利',20]);
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数
            }
        })

        /*分享到朋友圈*/
        wx.onMenuShareTimeline({
            title: shareWord.title, // 分享标题
            link: shareWord.localHref, // 分享链接
            imgUrl: shareWord.imgUrl, // 分享图标
            success: function () {
                // 用户确认分享后执行的回调函数
//                    _czc.push(["_trackEvent",'代理页分享到朋友圈','回调','有栗聚福利',21]);
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数

            }
        })
    })
}









