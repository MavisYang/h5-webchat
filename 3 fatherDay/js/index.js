/**
 * @author: mavis
 */
var type = getQueryString('type');//1:群宠 2:小助手朋友圈 other:景栗社群
var flag = 'home';
var nickName='';//宝宝昵称
var topicIndex=0;//题目
var recordPoint=[];//记录选中的point
var totalPoints=0;//总分
var testReslut='';//测试结果
var resultValue;//价值
var currentPoint='';//选中的当前分数
var nextPoint='';//下一题
var controller={
    init:function () {
        // alert(type)
        // alert(document.documentElement.clientHeight)
        // alert(document.documentElement.clientWidth)
        // $('body').css("background",'url("./images/bg.png") no-repeat');
        // $('.form').hide();
        // $('.result').show();
        // makeCanvas()

        var self = this
        if(flag=='home'){
            $('body').css("background",'url("./images/bg_home.png") no-repeat')
        }
        $('.nickName').on('input',function (e) {
            nickName = e.target.value
        })
        $('.btn').on('click',function () {
            if(nickName!=''){
                self.selectPoint()
            }else{
                alert('输入宝宝的昵称')
            }
        })

    },
    selectPoint:function () {
        flag = 'option';
        $('body').css("background",'url("./images/bg.png") no-repeat');
        $('.form').hide();
        $('.container').show();
        $('.listItem .itemLi').each(function (index,item) {
            $(item).click(function () {
                var self= $(this)
                self.addClass('borderHover').siblings().removeClass('borderHover')
                currentPoint = self.attr('data-point');
                nextPoint = self.attr('data-index');
            })
        })
    },
    nextOption:function (self) {
        var parentsBox = self.parents('.topicView');
        var nextBox = parentsBox.next();
        if(currentPoint==''){
            alert('请选择')
            return false
        }
        recordPoint = recordPoint.concat(currentPoint);
        totalPoints += parseInt(currentPoint);

        if(nextPoint==5){ //选择完毕
            $('body').css("background",'url("./images/bg1.png") no-repeat');
            this.selectOver()
        }else{
            topicIndex=nextPoint;
            currentPoint='';//清空当前分数
            parentsBox.hide()
            nextBox.show()
        }


    },
    //测试结果展示
    selectOver:function () {
        resultData.forEach(function (item) {
            var minRange = parseInt(item.minRange),
                maxRange = parseInt(item.maxRange),
                gradeIndex = item.gradeIndex;
            if(totalPoints>=minRange&&totalPoints<=maxRange){
                testReslut = randomValue(item.result)
                resultValue = gradeResult(gradeIndex)
            }
        })
        if(testReslut!=null){
            makeCanvas()
            $('.container').hide();
            $('.result').show()

        }
    }

}
/**
 * 获取getQueryString
 * @param {Number} getQueryString
 */
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)
        return (r[2]);
    return null;
}
/**
 * 选取范围内随机值
 * @param {Number} arr - 数组列表
 */
function randomValue(arr) {
    var index = Math.floor(Math.random()*arr.length)
    return arr[index]
}
/**
 * 随机结果展示
 * @param {Number} index - 表示第几档次
 */
function gradeResult(index) {
    switch (index){
        case 0:
            return '-1';
            break;
        case 1: //0~1
            return randomFrom2(0,1);
            break;
        case 2://100万－200万随机
            return randomFrom(1000000,2000000);
            break;
        default:
            break;
    }
}
/**
 * 选取0~1内随机值
 * @param {Number} min - 下限（或上限）
 * @param {Number} max - 上限（或下限）
 * @returns {Number} - 上下限区间内的随机值
 */
function randomFrom2(min, max) {
    // return  Number((Math.random()*1).toFixed(1)) //[0,1]
    return  Math.round((Math.random() * (max - min) + min) * 10) / 10;//[0,1]

}
/**
 * 选取范围内随机值
 * @param {Number} min - 下限（或上限）
 * @param {Number} max - 上限（或下限）
 * @returns {Number} - 上下限区间内的随机值
 */
function randomFrom(min, max) {
    var temp;
    if (min > max) {
        temp = min;
        min = max;
        max = temp;
    }
    return Math.floor(Math.random() * (max - min + 1) + min);
}


//结果页面
var makeCanvas = function() {
    var bgImg = new Image()
    var saveImg = new Image()

    //绘制canvas
    var canvas = document.createElement('canvas');
    canvas.width = 750;
    // canvas.height = 1181;
    canvas.height = 1208;
    // canvas.height = 1334;
    var ctx = canvas.getContext('2d');

    //获取img 图片展示
    var showImg = document.getElementById('showImg')
    var shareImg = document.getElementById('shareImg')

    bgImg.src = testReslut;
    var saveImgSrc='';
    if(type==1){//1:群宠
        saveImgSrc='./images/share1/share-'+testReslut.split('-')[1].slice(0,1)+'.png'
    }else if(type==2){//2:小助手朋友圈
        saveImgSrc='./images/share2/share-'+testReslut.split('-')[1].slice(0,1)+'.png'
    }else{//other:景栗社群
        saveImgSrc='./images/share3/share-'+testReslut.split('-')[1].slice(0,1)+'.png'
    }
    console.log(saveImgSrc,'saveImgSrc')
    saveImg.src= saveImgSrc;

    bgImg.onload=function () {
        ctx.drawImage(bgImg, 0, 0);

        ctx.font='40px PingFangSC-Semibold';
        ctx.fillStyle='#0A77FF';
        ctx.fillText(nickName, 185, 130);
        underline(ctx,nickName ,185,150,'#0A77FF',4);//下划线

        var measureText = ctx.measureText(nickName).width;
        ctx.font='40px PingFangSC-Semibold';
        ctx.fillStyle='#222222';
        ctx.fillText('爸爸的价值是：', 185+measureText+10, 130)

        showImg.src= canvas.toDataURL('image/*')

    }

    saveImg.onload=function () {
        ctx.drawImage(saveImg, 0, 0);

        ctx.font='40px PingFangSC-Semibold';
        ctx.fillStyle='#0A77FF';
        ctx.fillText(nickName, 185, 130);
        underline(ctx,nickName ,185,150,'#0A77FF',4)

        var measureText = ctx.measureText(nickName).width;
        ctx.font='40px PingFangSC-Semibold';
        ctx.fillStyle='#222222';
        ctx.fillText('爸爸的价值是：', 185+measureText+10, 130);

        // shareImg.src=canvas.toDataURL('image/*')

        $.ajax({
            url: 'https://cloud.gemii.cc/lizcloud/api/e-goods-api/noauth/miniprogram/good/poster',
            type: 'POST',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({
                "data": canvas.toDataURL('image/*'),
                "goodName": ''
            }),
            success: function (res) {
                if (res.resultCode === '100'){
                    console.log(res.resultContent)
                    shareImg.src = res.resultContent;
                }
            },
            fail: function (){
                console.log('fail');
            }
        })

    }
}

var underline = function(ctx,text ,x,y,color,thickness) {
    var width = ctx.measureText(text).width;
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = thickness;
    ctx.moveTo(x, y);
    ctx.lineTo(x + width, y);
    ctx.stroke();
}

