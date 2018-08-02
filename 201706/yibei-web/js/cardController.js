/**
 * Created by mavis on 2017/5/26.
 */
var controller={
    // 页面初始化，使最外层的div的高度=window的高度
    init:function () {
        this.pushHistory();
        document.getElementById("cardView").style.height=document.documentElement.clientHeight+"px";
        this.getOpenid();
        document.getElementById("privacyBtn").onclick=modelBox.modelShow;
        document.getElementById("closeIcon").onclick=modelBox.modelFade;
        document.getElementById("modelBtn").onclick=modelBox.modelAgree;
        document.getElementById("submitBtn").onclick=this.submit;
        this.isChecked();
        this.stopFocus();
    },
    url: {
        userInfo: wxIp + "wx/base/getUserInfo", //获取openid
        isRobotid:  groupIp + 'HelperManage/enter/select/robotUrl' //判断是否已经进入过此页面的接口
    },
    getOpenid:function () {     //通过code获取opendid
        var url=this.url.userInfo;
        $.ajax({
            url:url,
            type:"get",
            dataType:"json",
            data:{"code":getQueryString("code")},
            success:function (res) {
                var openid=res.data.openid; //id
                this.whichPage(openid);
            }.bind(this)
        })
    },
    //根据openId判断进去到哪个页面
    whichPage:function (openid) {
        var url=this.url.isRobotid;
        $.ajax({
            url:url,
            type:"post",
            dataType:"json",
            data:{
                "openid":openid,
                "type":"7"
            },
            success:function (res) {
                if(res.status==200){  //status:200表示已经有该用户的信息，直接跳转到QRcode页面
                    if(res.data != null){
                        window.location.href="QRCode.html?QRCodeUrl="+res.data.qr_url+"&validate="+res.data.verify_code;
                    }else{
                        window.location.href="sorry.html";
                    }
                }else if(res.status==2){
                    window.location.href="againRepeat.html";
                }else{
                    this.getInfo();
                }
            }.bind(this)
        })
    },
    //获取city和hospital值
    getInfo:function () {
        var info=decodeURI(getQueryString("info"));
        console.log(info);
        $("#city").val(info=='null'?'':info);
    },
    submit:function () {
        cookieFunction.setCookie();
    },
    isChecked:function () {
        $("label[for=privacyChecked]").click(function () {
            if($("input[id=date]").val()==""){
                if($("#privacyChecked").is(":checked")){
                    $("#submitBtn").attr("disabled",'disabled').removeClass("bgColor_checked").addClass("bgColor_grey");
                }else{
                    $("#submitBtn").removeAttr("disabled").removeClass("bgColor_grey").addClass("bgColor_checked");
                };
            }else{
                if($("#privacyChecked").is(":checked")){
                    $("#submitBtn").attr("disabled",'disabled').removeClass("bgColor_checked").addClass("bgColor_grey");
                }else{
                    $("#submitBtn").removeAttr("disabled").addClass("bgColor_checked").removeClass("bgColor_grey");
                };
            }

        })
    },
    pushHistory:function(){
        var bool = false;
        setTimeout(function () {
            bool = true;
        }, 1500);
        window.addEventListener("popstate", function () {
            if (bool) {
                window.location.reload();//根据自己的需求实现自己的功能
            }
            this.pushHistory();
        }, false);
        var state = {
            title: "title",
            url: "#"
        };
        window.history.replaceState(state, "title", "#");
    },
    stopFocus:function () {
        $("input[name='edc']").focus(function () {
            document.documentElement.blur();
        })
    }
}
var cookieFunction = {
    getCookie: function () {
        var current;
        var setData = new Object();
        if (($.cookie("data")) != undefined) {
            current = JSON.parse($.cookie("data"));
            if (current == undefined || current == "" || current == null) {
                return;
            }
            // console.log(current);
            //获取cookie值
            for (var k in current) {
                setData[k] = current[k];
                console.log(k, current[k])
            }
        }
    },
    setCookie: function () {
        var judgeFlag = true;
        var cookieData = new Object();        // 类似于var cookieDate={}创建对象
        var allInput = document.querySelectorAll("input[class='content_info']");
        // 2010-08-01至2018-07-31
        var edc = $("#predateSelect span").text();
        if(!/^[0-9]{4}\/[0-9]{2}\/[0-9]{2}/.test(edc)){ alert("请选择预产期"); return false; }
        if (edc != "") {
            var nowTime = new Date(edc).getTime();
            var maxTime = new Date(2018, 6, 31).getTime();
            var minTime = new Date(2010, 7, 1).getTime();
            if (minTime <= nowTime && nowTime <= maxTime) {
                cookieData.edc = edc;
            } else {
                var branchs='<div class="confirmBox_area">' +
                    '<div class="confirmBox">' +
                    '<div class="confirmBox_title">' +
                    "您选择的预产期有误,请检查后重新选择" +
                    '</div>'+
                    '<div class="confirmBox_submit">确定</div>'+
                    '</div>'+
                    '</div>';
                $("body").append(branchs);
                $(".confirmBox_submit").click(function () {
                    $(".confirmBox_area").remove();
                    $("#date").val("");
                    $("#predateSelect span").text("选择预产期/生日");
                })
                return false;
            }
        }
        $.each(allInput, function (k, v) {
            if (v.value == '') {
                judgeFlag = false;
                return false;
            } else {
                cookieData[v.name] = v.value;
            }
        });
        try {
            // 判断日期是否有选择（非空判断）
            if (judgeFlag) {    //判断成功之后点击按钮进入到页面
                location.href= userInfo;
            } else {
                throw "请完善信息"
            }
        } catch (err) {
            alert(err);
            return false;
        }
        // 存入cookie
        $.cookie("data",JSON.stringify(cookieData),{"expires":1});
    }
}
var modelBox={
    modelShow:function () {
        $(".model").removeClass("fade");
    },
    modelFade:function () {
        $(".model").addClass("fade");
    },
    modelAgree:function () {
        $("#privacyChecked").prop("checked", false);
        $("label[for=privacyChecked]").trigger("click");
        $(".model").addClass("fade");
    }
}

function get_predate(obj){
    if (obj.value == "" && $("#predateSelect span").text() == "") {
        $("#predateSelect span").text("选择预产期／生日");
    }else{
        $("#predateSelect span").text(obj.value.replace(/\-/g,"/"));
    }
    // if(!$("#privacyChecked").is(":checked"))
    //     $(".submitBtn").removeClass("bgColor_grey");

}