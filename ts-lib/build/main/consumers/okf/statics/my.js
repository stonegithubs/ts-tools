var seed;

$(function () {
    $.getJSON('/captcha').then(function (data) {
        seed = data.seed;
        initGeetest({
            gt: data.gt,
            width: '100%',
            lang: 'zh-cn',
            protocol: 'https://',
            timeout: '30000',
            challenge: data.challenge,
            new_captcha: data.new_captcha,
            product: "bind", // 产品形式，包括：float，embed，popup。注意只对PC版验证码有效
            offline: !data.success // 表示用户后台检测极验服务器是否宕机，一般不需要关注
            // 更多配置参数说明请参见：http://docs.geetest.com/install/client/web-front/
        }, handler);
    })
})


function handler(captchaObj) {
    captchaObj.onReady(function () {
        // 验证码预加载完毕

    }).onSuccess(function () {
        var result = captchaObj.getValidate();
        if (!result) {
            return false;
        }
        result.seed = seed;
        $.post('/captcha', result);
    });
    setTimeout(function () {
        captchaObj.verify();
    }, 400);

    // $('.getSms').click(function () {
    //     var mobile = $('#mobile').val();
    //     var password = $('#password').val();
    //     var repwd = $('#repwd').val();
    //     if (mobile == '') {
    //         layer.msg("请输入手机号");
    //         return false;
    //     } else {
    //         if (!/^1[3|4|5|7|8][0-9]{9}$/.test(mobile)) {
    //             layer.msg("请输入正确的手机号");
    //             return false;
    //         }
    //     }
    //     if (password == '') {
    //         layer.msg("请输入密码", { icon: 5 });
    //         return false;
    //     } else {
    //         if (!/^[\s\S]{6,}$/.test(password)) {
    //             layer.msg("请输入6到12位字母或数字");
    //             return false;
    //         }
    //     }
    //     if (repwd == '') {
    //         layer.msg("请确认密码");
    //         return false;
    //     } else {
    //         if (repwd != password) {
    //             layer.msg("两次密码输入不一致");
    //             return false;
    //         }
    //     }
    //     var mobile_verfiy = $('#mobile_verfiy').val();
    //     if (mobile_verfiy == 1) {
    //         captchaObj.verify();
    //     } else {
    //         layer.msg("该手机号已注册请登录", { icon: 5 });
    //         return false;
    //     }

    // });

    // 更多接口参考：http://docs.geetest.com/install/client/web-front/#实例
};

// function getSms(data){
//     // 注册验证
//     var $getSms = $(".getSms"),
//         $codeUrl = "/index/code/getcode.html";
//     var captcha = $('#captcha').val();
//     var mobile = $('#mobile').val();
//     if(mobile == ''){
//         layer.msg("请输入手机号", {icon : 5});
//         return false;
//     }else{
//         if(!/^1[3|4|5|7|8][0-9]{9}$/.test(mobile)){
//             layer.msg("请输入正确的手机号", {icon : 5});
//             return false;
//         }
//     }
//     if(!data){
//         layer.msg("请完成验证");
//         return false;
//     }
//     var mobile = $('#mobile').val();
//     var vData = {
//         mobile:mobile,
//         geetest_challenge:data.geetest_challenge,
//         geetest_validate:data.geetest_validate,
//         geetest_seccode:data.geetest_seccode
//     }
//     $.post($codeUrl,vData,function(data){
//         layer.msg(data.msg);
//         if(data.code==1){
//             endTime($getSms);
//         }
//         return false;
//     })

//     return false;
// }