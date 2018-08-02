/**
 * Created by mavis on 2017/6/1.
 */
var modelFlag = false;
var para = false;  //此处只有填写地址的model
var btnFlag=true;
var postInfoData = new Object();
var controller = {
    init:function () {
        this.getInitData();
        this.closeModel(); //关闭弹窗
        this.postInfo();   //提交信息
        this.lotteryAgain();//立即抽奖
    },
    getInitData: function () {
        $.ajax({
            url: groupIp + 'moac/selectMoRecord?openid=' + openid,
            type: "get",
            success: function (res) {
                var data = res.data;
                console.log(data)
                var btnClass, btnText, branch, disabled;
                if (data.isMore === 'F') { //isMore：F抽过、T未抽过
                    if (data.records !== '' && data.records !== null && data.records !== undefined && data.records.length > 0) {
                        for (var id in data.records) {
                            if (data.records[id].rewardType === "e") {  //电子券
                                btnClass = "unDoneBtn"
                                btnText = "点击领取"
                                disabled = false;
                            } else if (data.records[id].rewardType === "t") {   //实物
                                if (data.records[id].address === "T") {   //T表示已领取已提交
                                    btnClass = "doneBtn";
                                    btnText = "已提交"
                                    disabled = "disabled"
                                } else {
                                    btnClass = "unDoneBtn"
                                    btnText = "提交地址"
                                    disabled = false
                                }
                            };
                            branch = '<div class="lotteryBox">' +
                                '<span class="coupon">' + data.records[id].rewardName + '</span>' +
                                '<button class=' + btnClass + ' id=' + data.records[id].id + ' ' +
                                'onclick=eventFunctions.negative(this) ' +
                                'name=' + data.records[id].rewardId + data.records[id].elecUrl + '>' + btnText + '</button>' +
                                '</div>';
                            $(".wrap").append(branch);
                            if (data.records[id].address === "T" && data.records[id].rewardType === "t") {
                                $("button[id=" + data.records[id].id + "]").attr("disabled", true)
                            }
                            btnFlag = false
                            if (!btnFlag) {
                                $(".againLottery").css('display', 'none')
                            }
                        }
                    }
                    else {//谢谢参与
                        btnFlag = false
                        if (!btnFlag) {
                            $(".againLottery").css('display', 'none')
                        }
                        branch = '<div class="prompt">' +
                            '<img src="image/liziShort-02.png" alt="">' +
                            '<p>您已抽奖,' +
                            '<br>' +
                            '谢谢参与</p>' +
                            '</div>';
                        $(".wrap").empty().append(branch);
                    }

                } else if (data.isMore === 'T') { //T未抽过
                    branch = '<div class="prompt">' +
                        '<img src="image/liziShort-02.png" alt="">' +
                        '<p>您还没有抽奖哦,' +
                        '<br>' +
                        '快去抽奖吧～</p>' +
                        '</div>';
                    $(".wrap").empty().append(branch);
                }
            }.bind(this)
        })
    },
    handleAddress: function (arr) {
        var value = arr.length == 2 ? arr[0].value + arr[1].value : arr[0].value + arr[1].value + arr[2].value;
        var sendValue = arr.length == 2?arr[0].value +"-"+ arr[1].value:arr[0].value +"-"+ arr[1].value +"-"+ arr[2].value;
        $("#address").val(value).attr("name","city"+sendValue);
    },
    closeModel: function () {
        $(".modelClose").click(function () {
            console.log("close")
            modelFlag = false;
            para = false;
            eventFunctions.handleModel()
        })
    },
    lotteryAgain: function () {
        $(".againBtn").click(function () {
            window.location.href = "index.html";
        })
    },
    postInfo: function () {
        $(".fill_submit").click(function (e) {
            var judgeFlag = true;
            var inputArr = $("input[type=text]")
            inputArr.map(function (k,v) {
                console.log(v.value)
                if(v.value==""){
                    judgeFlag = false;
                    return false;
                }
                if(v.id == "address"){
                    postInfoData["city"] = v.name.substr(4);
                }else {
                    postInfoData[v.name] = v.value
                }
            })
            //手机号验证和非空验证
            try {
                if(judgeFlag == false){
                    throw "请完善信息"
                }
            }catch (err){
                alert(err);
                return false;
            }
            try {
                var phoneInput = $("input[name=phone]");
                if (!(/^1[34578]\d{9}$/.test(phoneInput.val()))) {
                    throw "请输入正确手机号";
                }
            }catch (err){
                alert(err);
                $("input[name=phone]").focus();
                return false;
            }
            postInfoData.recordId = e.target.id
            console.log(postInfoData)
            $.ajax({
                url:groupIp+'moac/insertMoAddress',
                type:'post',
                data:postInfoData,
                success: function (res) {
                   console.log(res)
                   if(res.status==200){
                       modelFlag = false;
                       eventFunctions.handleModel()
                       var branch =
                           '<div class="success-icon"></div>' +
                           '<div style="width: 80%;height: 80px;display: table-cell;vertical-align: middle;">' +
                           '提交成功' +
                           '</div>';
                       $(".shadowBox").css({"display":"block"}).empty().append(branch)
                       $("button[id="+e.target.id+"]").attr("disabled",true).removeClass("unDoneBtn").addClass("doneBtn").text('已提交')
                       setInterval(function () {
                           $(".shadowBox").css({"display":"none"})
                       },2000)
                   }
                }.bind(this)
            })
        })
    },

}

var eventFunctions = {
    negative: function (e) {
        var self = this;
        if(e.name.substr(0,1)==="t"){
            modelFlag = true
            self.handleModel()
            $(".fill_submit").attr("id",e.id);
            new MultiPicker({
                input: 'address',//点击触发插件的input框的id
                container: 'addressContainer',//插件插入的容器id
                jsonData:$city,
                success: function (arr) {
                    controller.handleAddress(arr);
                }//回调
            });
        }else if(e.name.substr(0,1)==="e"){//特殊奖品和电子券跳转elecUrl
           console.log(e.name.substr(3))
            window.location.href = e.name.substr(3).trim();
        }
    },
    handleModel: function () {
        $(".popupModel")[0].style.display = modelFlag == false?"none":"block";
        $(".userInfo")[0].style.display = modelFlag == false?"none":"block";
    }
}