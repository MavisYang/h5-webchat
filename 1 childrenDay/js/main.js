/**
 * @author: ckm
 */
var upImg = "";
var currentIndex = 0;
var answers = [0,0,0,0];  //1 - A, 2 - B, 3 - C
//初始化首页
var initFirst = function () {

    var pc = new PhotoClip('#clipArea', {
        size: [357,354],
        outputSize: [357,354],
        file: '#file',
        view: '#view',
        ok: '#submit',
        loadStart: function () {
            console.log('开始读取照片');
        },
        loadComplete: function () {
            console.log('照片读取完成');
            $("#img_button").addClass('reUpload');
            $(".sub_btn").show();
        },
        done: function (dataURL) {
            // console.log(dataURL);
            upImg = dataURL;
            getImage();
            $('#upload').hide();
            $('.addThingsOne').show();
            //开始测试
            _czc.push(["_trackEvent", '测试页面', '确认提交', 'submit']);
        },
        fail: function (msg) {
            alert(msg);
        }
    });

    $('#file').on('change', function(e) {
        console.log(e);
        upPicture(e);
    });
    // $(".sub_btn").on('touchstart', () => {
    //     $('#upload').hide();
    //     $('.addThingsOne').show();
    // });
    //第一把料
    for (var i = 0; i < 4; i++){
        (function (i) {
            $(".question_one:eq(" + i + ")").on('touchstart', function (e) {
                console.log(e.target);
                $(e.target).addClass('question_one_active');
                var pages = getPage();
                answers[i] = i === 0 ? 'A' : 1;
                pushPage(pages[0], pages[1]);
            });
            $(".question_two:eq(" + i + ")").on('touchstart', function (e) {
                console.log('two');
                $(e.target).addClass('question_two_active');
                var pages = getPage();
                answers[i] = i === 0 ? 'B' : 2;
                pushPage(pages[0], pages[1]);
            });
            $(".question_thr:eq(" + i + ")").on('touchstart', function (e) {
                console.log('thr');
                $(e.target).addClass('question_thr_active');
                var pages = getPage();
                answers[i] = i === 0 ? 'C' : 3;
                pushPage(pages[0], pages[1]);
            });
        })(i)
    }
};

//上传头像
var upPicture = function (e) {
    var files = e.target.files,
        file;
    if (files && files.length > 0) {
        file = files[0];
        console.log(files);
    }
};

var getPage = function () {
    if (currentIndex === 0){
        return ['.addThingsOne', '.addThingsTwo'];
    } else if (currentIndex === 1){
        return ['.addThingsTwo', '.addThingsThr'];
    }  else if (currentIndex === 2){
        return ['.addThingsThr', '.addThingsFour'];
    } else if (currentIndex === 3){
        return ['.addThingsFour', '.adding'];
    }
};

//add thing
var pushPage = function (current, next) {
    setTimeout(function() {
        $(current).hide();
        $(next).show();
        if (next === '.adding') {
            $('.pro').addClass('pro_1');
            setTimeout(function() {
                pushPage('#schedule', '#result');
                $('#schedule').remove();
                //结果页面
                _czc.push(["_trackEvent", '测试结果页', '点击', 'result']);
            }, 2000);
            makeCanvas();
        }
    }, 500);
    currentIndex++;
};

//选择卡通人物
var switchHero = function () {
    console.log('answer:' + answers);
    var result = answers[0] + answers[1];
    var hero = '';
    switch (result){
        case 'A1':
            console.log('美少女战士');
            hero = 'msn';
            break;
        case 'A2':
            console.log('皮卡丘');
            hero = 'pkq';
            break;
        case 'A3':
            console.log('吴亦凡');
            hero = 'wyf';
            break;
        case 'B1':
            console.log('柯南');
            hero = 'kn';
            break;
        case 'B2':
            console.log('蜡笔小新');
            hero = 'lbxx';
            break;
        case 'B3':
            console.log('老干妈');
            hero = 'lgm';
            break;
        case 'C1':
            console.log('超人');
            hero = 'cr';
            break;
        case 'C2':
            console.log('葫芦娃');
            hero = 'hlw';
            break;
        case 'C3':
            console.log('马云');
            hero = 'my';
            break;
        default:
            break;

    }
    return hero;
};

//结果页面卡通人物合成
var makeCanvas = function(){
    var bgImg = new Image();
    var saveImg = new Image();

    var headerImg = new Image();
    var headerImg1 = new Image();

    var bodyImg = new Image();
    var bodyImg1 = new Image();
    var canvas = document.createElement('canvas');
    canvas.width = 750;
    canvas.height = 1206;
    var ctx = canvas.getContext('2d');
    //外层canvas
    var canvas2 = document.createElement('canvas');
    canvas2.width = 750;
    canvas2.height = 1206;
    var ctx2 = canvas2.getContext('2d');
    //底图
    var img = document.getElementById('img1');
    var img2 = document.getElementById('img2');

    // img.setAttribute('id', 'img1');
    //
    // img2.setAttribute('id', 'img2');
    // img.src = "../images/result/my_bg.png";
    // img2.src = '../images/result/my_poster.png';

    var hero = switchHero();

    var size = hero === 'my' ? 194 : 190;

    bgImg.src = '../images/result/'+ hero +'_bg.png';

    saveImg.src = '../images/result/'+ hero +'_poster.png';

    bgImg.onload = function () {
        //绘制背景
        ctx.drawImage(bgImg, 0, 0, 750, 1206);
        headerImg.src = upImg;
        headerImg.onload = function () {
            ctx.drawImage(headerImg, 292, 325, size, size);
            //绘制身体
            bodyImg.src = '../images/result/' + hero + '_pic.png';
            bodyImg.onload = function () {
                ctx.drawImage(bodyImg, 0, 70, 750, 830);
                //转图片显示
                img.src = canvas.toDataURL('image/*')
            }
        };
    };

    saveImg.onload = function () {
        //绘制背景
        ctx2.drawImage(saveImg, 0, 0, 750, 1206);
        headerImg1.src = upImg;
        headerImg1.onload = function () {
            ctx2.drawImage(headerImg1, 292, 325, size, size);
            //绘制身体
            bodyImg1.src = '../images/result/' + hero +'_pic.png';
            bodyImg1.onload = function () {
                ctx2.drawImage(bodyImg1, 0, 70, 750, 830);
                //转图片显示
                $.ajax({
                    url: 'https://cloud.gemii.cc/lizcloud/api/e-goods-api/noauth/miniprogram/good/poster',
                    type: 'POST',
                    contentType: 'application/json',
                    dataType: 'json',
                    data: JSON.stringify({
                        "data": canvas2.toDataURL('image/*'),
                        "goodName": hero
                    }),
                    success: function (res) {
                        if (res.resultCode === '100'){
                            img2.src = res.resultContent;
                        }
                    },
                    fail: function (){
                        console.log('fail');
                    }
                })
            }
        };
    };
};

//圆角矩形
CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
    var min_size = Math.min(w, h);
    if (r > min_size / 2) r = min_size / 2;
    // 开始绘制
    this.beginPath();
    this.moveTo(x + r, y);
    this.arcTo(x + w, y, x + w, y + h, r);
    this.arcTo(x + w, y + h, x, y + h, r);
    this.arcTo(x, y + h, x, y, r);
    this.arcTo(x, y, x + w, y, r);
    this.closePath();
    return this;
};

var getImage = function(){
    var canvas = document.createElement('canvas');
    canvas.width = 342;
    canvas.height = 342;
    var ctx = canvas.getContext('2d');
    var img = new Image();
    img.src = upImg;
    img.onload = function () {
        var pattern = ctx.createPattern(img, 'no-repeat');
        ctx.roundRect(0,0, 342, 342, 171);
        ctx.fillStyle = pattern;
        ctx.fill();
        upImg = canvas.toDataURL('image/*');
        // console.log(canvas.toDataURL('image/*'));
        // return canvas.toDataURL('image/*');
    };
};


$(document).ready(function () {
    initFirst();
});