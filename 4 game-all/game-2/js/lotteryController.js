/**
 * Created by mavis on 2017/6/1.
 */

var Flag;
var modelFlag = false;//模态框的开关 //true 抽奖结束 false 抽奖开始
var para = 0;//自定义的状态：不同的状态时div隐藏与否
var ruleFlag = true; //查看规则的model
var isMoreFlag = true;//表示可抽奖，false表示不可抽奖
var controller = {
    init: function () {
        this.getInitData();//判断是非可抽奖
        this.closeModel(); //关闭弹窗
        this.getPrize();   //点击领奖
        this.getReward();  //点击查看历史中奖
        this.getRule();    //查看规则
        this.postInfo();   //提交信息
        eventFunctions.handleModel();
    },
    getInitData: function () {
        $.ajax({
            url: groupIp + 'moac/verifyLoadReward?openid=' + openid,
            type: 'get',
            success: function (res) {
                console.log(res)
                if (res.status == 200) {
                    if(res.data.isMore == "F"){// isMore：（T是F否）
                        isMoreFlag = false;
                    }
                    this.lottery()
                }
            }.bind(this)
        })
    },

    lottery: function () {
        $(".butt").click(function () {
            console.log(isMoreFlag)
            if (!isMoreFlag) {
                modelFlag = true;
                para = 2;
                eventFunctions.handleModel();
                $(".partTitle").text("不要太贪心哦～")
                $(".partIMG").css({"background": "url('image/liziShort.png')no-repeat center center "})
                $(".partState").empty().text("每位妈妈只能抽取一次");
                $(".negativeButton").val("查  看").attr("name", 'history.html');
                return;
            }
            if (!Flag) {
                Flag = true;
                $(this).attr("disabled", true)
                eventFunctions.rotate();
            }
        });
    },
    closeModel: function () {
        $(".modelClose").click(function () {
            modelFlag = false;
            ruleFlag = true;
            para = 0;
            eventFunctions.handleModel()
        })
    },
    handleAddress: function (arr) {
        var value = arr.length == 2 ? arr[0].value + arr[1].value : arr[0].value + arr[1].value + arr[2].value;
        var sendValue = arr.length == 2 ? arr[0].value + "-" + arr[1].value : arr[0].value + "-" + arr[1].value + "-" + arr[2].value;
        $("#address").val(value).attr("name", "city" + sendValue);
    },
    getPrize: function () {
        $(".negativeButton").click(function (e) {
            if (e.target.name==="JUMP") {   //积分不足跳转个人中心
                $(".modelClose").trigger('click')
                return
            }
            if(e.target.name==='history.html'){
                window.location.href = e.target.name
                return
            }
            if (e.target.name.substr(0, 1) === "t") {
                //一般实物奖品
                para = 1;
                eventFunctions.handleModel();
                $(".fill_submit").attr("id", e.target.id)
                new MultiPicker({
                    input: 'address',//点击触发插件的input框的id
                    container: 'addressContainer',//插件插入的容器id
                    jsonData: $city,
                    success: function (arr) {
                        console.log(arr)
                        controller.handleAddress(arr);
                    }//回调
                });
            } else {     //特殊奖品和电子券跳转elecUrl
                console.log(e.target.name)
                window.location.href = e.target.name.substr(3).trim();
            }
        })
    },
    //点击查看规则
    getRule: function () {
        $(".lotteryRule").click(function () {
            modelFlag = true;
            ruleFlag = false;
            para = 2;
            eventFunctions.handleModel()
            $(".partTitle").text("抽奖规则")
            $(".partIMG").css({"background": "url('image/rule.png')no-repeat center center "})
            $(".partState").empty().append("<ol style='text-align: left;margin-left:30px;font-size: 22px;line-height: 29px'><li>成为栗子妈妈俱乐部会员即可获得一次抽奖机会 </li>" +
                "<li>其余每次抽奖消耗5个栗子，不限次数，可多次抽取 </li>" +
                "<li>奖池包含礼盒、小样、优惠券等礼品，礼品多多快来参与。</li></ol>")
        })
    },
    //点击进入到历史中奖页面
    getReward: function () {
        $(".history").click(function () {
            window.location.href = "history.html";
        })
    },
    postInfo: function () {
        $(".fill_submit").click(function (e) {
            var judgeFlag = true;
            var postInfoData = new Object()
            var inputArr = $("input[type=text]")
            inputArr.map(function (k, v) {
                console.log(v.value)
                if (v.value == "") {
                    judgeFlag = false;
                    return false;
                }
                if (v.id == "address") {
                    postInfoData["city"] = v.name.substr(4);
                } else {
                    postInfoData[v.name] = v.value
                }
            })
            //手机号验证和非空验证
            try {
                if (judgeFlag == false) {
                    throw "请完善信息"
                }
            } catch (err) {
                alert(err);
                return false;
            }
            try {
                var phoneInput = $("input[name=phone]");
                if (!(/^1[34578]\d{9}$/.test(phoneInput.val()))) {
                    throw "请输入正确手机号";
                }
            } catch (err) {
                alert(err)
                $("input[name=phone]").focus();
                return false;
            }
            postInfoData.recordId = e.target.id
            console.log(postInfoData)
            $.ajax({
                url: groupIp + 'moac/insertMoAddress',
                type: 'post',
                data: postInfoData,
                success: function (res) {
                    console.log(res)
                    if (res.status == 200) {
                        modelFlag = false;
                        para = 0;
                        eventFunctions.handleModel()
                        var branch =
                            '<div class="success-icon"></div>' +
                            '<div style="width: 80%;height: 80px;display: table-cell;vertical-align: middle;">' +
                            '提交成功' +
                            '</div>';
                        $(".shadowBox").css({"display":"block"}).empty().append(branch)
                        setInterval(function () {
                            $(".shadowBox").css({"display":"none"})
                        },2000)
                    }
                }
            })
        })
    },
}
var eventFunctions = {
    setDegree: function ($obj, deg) {
        $obj.css({
            'transform': 'rotate(' + deg + 'deg)',
            '-webkit-transform': 'rotate(' + deg + 'deg)'
        })
    },
    rotate: function () {
        var deg;
        var self = this;
        Flag = false;
        var $tar = $('.inner'),
            i, j,
            cnt = 100,
            total = 0, //旋转的度数
            ratio = [],
            offset = null, //设置初始值为空
            Famount = 9,
            amount = null,  //设置初始值为空
            rewardId = "",      //奖品ID
            rewardReply = "",   //奖品类型
            nickname = "",      //奖品name
            price = "",         //奖品价格
            elecUrl = "",       //奖品地址
            recordId = null,   //中奖记录id
            shortFlag = false,  //判断商品是否足够
            liziFlag = false,  //判断是否可抽奖
            shortFlagMsg = "",
            liziFlagMsg = "";
        ratio[1] = [ 0.2,0.4,0.6,0.8,1,1,1.2,1.4,1.6,1.8];
        ratio[2] = [ 1.8,1.6,1.4,1.2,1,1,0.8,0.6,0.4,0.2];
        console.log(groupIp + 'moac/loadMoReward?openid=' + openid)
        $.ajax({
            url: groupIp + 'moac/loadMoReward?openid=' + openid,
            type: 'get',
            dataType:"json",
            success: function (res) {
                console.log(JSON.stringify(res))
                if (res.status == 200) {
                    if(res.data.isMore == 'F'){ //不可抽奖
                        isMoreFlag = false;  //
                    }else{
                        isMoreFlag = true;
                    }
                    offset = parseInt(res.data.rewardId.substr(1) - 14);  //此处修改转盘完毕的位置
                    console.log('offset',offset)
                    rewardId = res.data.rewardId;       //rewardId:id
                    rewardReply = res.data.rewardType;  //rewardType：奖品类型（e电子券t实物）
                    recordId = res.data.recordId;       //recordId：中奖记录id
                    nickname = res.data.nickname;       //nickname：奖品
                    price = res.data.price;
                    elecUrl = res.data.elecUrl; //elecUrl:电子券url
                }else if(res.status == 10010){ //只能抽取一次
                    liziFlag = true;
                    liziFlagMsg=res.msg;
                }
                else if(res.status == 500){
                    shortFlag = true;
                    shortFlagMsg = res.msg;
                }
            }
        })

        for (i = 0; i < 100; i++) {
            setTimeout(function () {
                console.log(String(cnt).substr(0, 1))
                deg = Famount * ( ratio[String(cnt).substr(0, 1)][String(cnt).substr(1, 1)])*2; //旋转角度
                self.setDegree($tar, deg + total);//改变偏转
                total += deg;//记录
                cnt++;
            }, i * 50);
        }
        setTimeout(function () {
            // amount = amount == null?0:amount;
            offset = offset == null ? 0.5 : offset;
            amount = 9 - (0.6 * offset - 0.3);
            for (j = 0; j < 100; j++) {
                setTimeout(function () {
                    // console.log(deg)
                    deg = amount * ( ratio[2][String(cnt).substr(1, 1)] );
                    self.setDegree($tar, deg + total);//改变偏转
                    total += deg;//记录
                    cnt++;
                }, j * 50);
            }
        }, 100 * 50)
        setTimeout(function () {
            $(".butt").removeAttr("disabled")
            if (shortFlag == true) {
                alert(shortFlagMsg);
                return;
            }
            if(liziFlag == true){    //只能抽取一次
                modelFlag = true;
                para = 2;
                eventFunctions.handleModel();
                $(".partTitle").text("不要太贪心哦～")
                $(".partIMG").css({"background": "url('image/liziShort.png')no-repeat center center "})
                $(".partState").empty().text("每位妈妈只能抽取一次哦～");
                $(".negativeButton").val("查  看").attr("name", 'history.html');
                return;
            }
            if (rewardReply == "") {  //奖品类型为空时显示网络不稳定
                var branch =
                    '<div class="fresh-icon"></div>' +
                    '<div style="width: 80%;height: 80px;display: table-cell;vertical-align: middle;">' +
                    '网络不稳定请刷新重试' +
                    '</div>';

                $(".shadowBox").css({"display": "block"}).empty().append(branch)
                setInterval(function () {
                    $(".shadowBox").css({"display": "none"})
                }, 2000)
                return;
            }
            console.log("total:" + total)
            self.setModel(offset, rewardReply, recordId, nickname, price, elecUrl,rewardId);
        }, 200 * 50 + 500);
    },
    setModel: function (offset, rewardReply, recordId, nickname, price, elecUrl,rewardId) {
        var self = this;
        console.log(offset);
        modelFlag = true;
        para = 2;
        self.handleModel();
        console.log(12,rewardReply)
        $(".partTitle").text("恭喜您!")
        if (rewardReply === "e") { //电子券
            $(".partState").empty().text("亲爱的妈妈恭喜你获得此奖品");
            $(".partIMG").css({"background": "url('image/win.png')no-repeat center center ",'background-size': 'contain'})
            $(".negativeButton").val("领取电子券").attr("id", recordId).attr("name", rewardId + elecUrl);
        }
        if (rewardReply === "t") { //实物
            var partIMG;
            //根据rewardId判断图片显示
            if(rewardId==="t14"){
                partIMG = 'image/gift_t14.png';     //孩子敏感期教养的关键
            }else if(rewardId==="t16"){
                partIMG = 'image/gift_t16.png';     //最好的教育是等孩子自己长大
            }else if (rewardId === "t17") {
                partIMG = 'image/gift_t17.png';   //芭比
            }else if(rewardId==="t18"){
                partIMG = 'image/gift_t18.png';      //水
            }
            $(".partState").empty().text("亲爱的妈妈恭喜你获得此奖品");
            $(".partIMG").css({"background": "url(" + partIMG + ")no-repeat center center",'background-size': 'contain'})
            $(".negativeButton").val("领取实物礼品").attr("id", recordId).attr("name", rewardId + elecUrl);
        }
        if(rewardReply === "n"){ //谢谢参与
            $(".partTitle").empty().text("很遗憾，未中奖～")
            $(".partIMG").css({"background": "url('image/liziShort.png')no-repeat center center ",'background-size': 'contain'})
            $(".partState").empty().text("下次再接再厉～");
            $(".negativeButton").val("返  回").attr("id", recordId).attr("name", 'JUMP');
        }
    },
    handleModel: function () {
        $(".popupModel")[0].style.display = modelFlag == false ? "none" : "block";
        $(".btnContainer")[0].style.display = ruleFlag == false ? "none" : "block"
        if (para == 2) {   
            $(".partStatus")[0].style.display = "block"  //提示信息box
            $(".userInfo")[0].style.display = "none"
            $(".unFocus")[0].style.display = "none"
        } else if (para == 1) {
            $(".partStatus")[0].style.display = "none"
            $(".userInfo")[0].style.display = "block"
            $(".unFocus")[0].style.display = "none"
        } else if (para == 3) {
            $(".partStatus")[0].style.display = "none"
            $(".userInfo")[0].style.display = "none"
            $(".unFocus")[0].style.display = "block"
        }
    },
}