var shareWord={
    "title": '儿童益智图书专场',
    "desc":'4折起儿童图书特卖，送给宝宝的最好礼物',
    "imgUrl":'https://cloud.gemii.cc/lizcloud/fs/noauth/media/5aaf609b1e6d8a0039742f3a',
    "localHref":'http://wx.gemii.cc/gemii/producttopic/productIndex.html'
}

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
        async: false,
        success: function (json) {
            arraydata = eval(json)
        }
    });
    return arraydata;
}
dataLoad('js/data.json')

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









