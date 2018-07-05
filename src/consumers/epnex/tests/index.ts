export default `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
  <style>
    label{
      display: block;
    }
    button, input {
      border: 1px solid #eee;
      width: 100%;
    }
    .tip{
      color: #f00;
    }
    button{
      display: block;
      margin: auto;
    }
    img{
      max-width:100%;
    }
  </style>
</head>
<body>
  <form action="/t" method="post">
    <label for="yqm">
      邀请码(或者邀请链接): <input type="text" name='yqm' placeholder="邀请链接或邀请码,邀请码如:0BTLB0T,请仔细确认,填错无法更改">
    </label>
    <label for="count">
      邀请次数: <input type="text" name='count' value="" placeholder="小于200的整数">
    </label>
    <label for="inviteCode">
      脚本注册码: <input type="text" name='inviteCode' value="" placeholder="微信联系chosan179817004加群">
    </label>
    <label for="interval">
     注册频率(单位:分钟): <input type="text" name='interval' value="" placeholder="此项可不填,则随机2-10分钟注册一次">
   </label>
   <br>
    <button type="submit">提交 (提交之后不可修改)</button>
  </form>
 <br>
   <p class="tip">tip1: 请提交之后几分钟查看是否注册成功, 账号注册成功之后并不会立马进行手机号验证, 而是会在 2-5 分钟之间随机进行手机号验证, 在这期间账户奖励将处于冻结状态</p>
   <br>
   <p class="tip">tip2: 本脚本支持自动切换 ip，注册时间随机，且后期会对邀请过后的用户每天不定期进行自动签到等操作，模拟活人</p>
   <br>
   <p class="tip">tip2: 本脚本只负责撸毛，不保证官方最后一定会发币，比如垃圾 BOC </p>
 <br>
  后期可开放查看邀请注册的所有记录的账号、密码、验证手机号
  <br>
  <br>
  <img src="https://posts-1256188574.cos.ap-chengdu.myqcloud.com/luyhmk/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20180705234946.png" alt="案例">
</body>
</html>
`