/**
 * @author: ckm
 */
//初始化首页
function init() {

    $(".startBtn").on('touchstart', function () {
        setTimeout(function () {
            //点我开始加载拍照页面
            _czc.push(["_trackEvent", '拍照页面', '点我开始', 'startBtn']);

            //页面跳转
            location.assign(location.origin + "/gemii/childrenDay/pages/main.html");
            // location.assign(location.origin + "/pages/main.html");
        }, 500)
    });
    setTimeout(function () {
        $('#loading').hide();
        $("#readyToDo").show();
        //loading 结束加载开始页
        _czc.push(["_trackEvent", '开始页面', '自动加载', 'loading']);
    }, 2000)
};

$(document).ready(function () {
    init();
});