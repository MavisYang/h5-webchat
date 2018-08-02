var API_PATH = 'http://wx.gemii.cc/gemii/';
var product ='fatherDay';
var resultData=[
    {
        maxRange:'-3',
        minRange:'-5',
        gradeIndex:0,//0
        result:[
            './images/result-1.png',//古代马车
            './images/result-2.png'//依萍牌黄包车
        ]
    },
    {
        maxRange:'1',
        minRange:'-2',//(-2,-1,0,1)
        gradeIndex:1,//0-1
        result:[
            './images/result-3.png',//凤凰牌自行车
            './images/result-4.png',//豪爵摩托车
            './images/result-5.png'//东风绿皮火车
        ]
    },
    {
        maxRange:'5',
        minRange:'2',
        gradeIndex:2,//100万－200万随机
        result:[
            './images/result-6.png',//磁悬浮列车
            './images/result-7.png',//豪华游艇
            './images/result-8.png'//私人飞机
        ]
    }
]

function setWxShareConent(currentUrl,shareWord,type) {
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
    });

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
                if(type==1){ //1:群宠 2:小助手朋友圈 other:景栗社群
                    //群宠：http://wx.gemii.cc/gemii/fatherDay/index.html?type=1
                    _czc.push(["_trackEvent",'分享给朋友','回调','群宠-父亲节活动',1]);
                }else if(type==2){
                    //小助手朋友圈：http://wx.gemii.cc/gemii/fatherDay/index.html?type=2
                    _czc.push(["_trackEvent",'分享给朋友','回调','小助手朋友圈-父亲节活动',2]);
                }else{
                    //监测 景栗社群:http://wx.gemii.cc/gemii/fatherDay/index.html
                    _czc.push(["_trackEvent",'分享给朋友','回调','景栗社群-父亲节活动',3]);
                }

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
                if(type==1){ //1:群宠 2:小助手朋友圈 other:景栗社群
                    //群宠：http://wx.gemii.cc/gemii/fatherDay/index.html?type=1
                    _czc.push(["_trackEvent",'分享到朋友圈','回调','群宠-父亲节活动',11]);
                }else if(type==2){
                    //小助手朋友圈：http://wx.gemii.cc/gemii/fatherDay/index.html?type=2
                    _czc.push(["_trackEvent",'分享到朋友圈','回调','小助手朋友圈-父亲节活动',22]);
                }else{
                    //监测 景栗社群:http://wx.gemii.cc/gemii/fatherDay/index.html
                    _czc.push(["_trackEvent",'分享到朋友圈','回调','景栗社群-父亲节活动',33]);
                }
            },
            cancel: function () {
                // 用户取消分享后执行的回调函数

            }
        })
    })
}
