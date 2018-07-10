"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>羊毛</title>
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
    li{
      margin-bottom: 10px;
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
      脚本注册码: <input type="text" name='inviteCode' value="" placeholder="往下滑扫码加微信加群">
    </label>
    <label for="interval">
     注册频率(单位:分钟): <input type="text" name='interval' value="" placeholder="此项可不填,则随机2-10分钟注册一次">
   </label>
   <br>
    <button type="submit">提交 (提交之后不可修改)</button>
  </form>
 <br>
 <b>提示:</b>
   <ol>
   <li class="tip">请提交之后几分钟查看是否注册成功, 账号注册成功之后并不会立即进行手机号验证, 而是会在 2-5 分钟之间随机进行手机号验证, 在这期间账户奖励将处于冻结状态</li>
   <li class="tip">本脚本支持自动切换 ip，注册时间随机，注册完成之后会对注册账户进行签到和模拟分享, 且后期会对邀请过后的用户每天不定期进行自动签到等操作，模拟活人</li>
   <li class="tip">本脚本只负责撸毛，不保证官方最后一定会发币，比如垃圾 BOC </li>
   <li class="tip">由于成功率超高, 如果不希望 100% 的成功率(一般账户可能存在邀请用户未验证手机号的情况), 请手动随机注册几次未验证账号 </li>
   <li class="tip">脚本支持热升级, 升级过程对用户透明, 一般情况无需再次提交信息, 如需要再次提交, 届时会在群里通知 </li>
   </ol>
 <br>
  如有需要后期可开放查看邀请注册的所有记录的账号、密码、验证手机号
  <br>
  <br>
  <img src="https://posts-1256188574.cos.ap-chengdu.myqcloud.com/luyhmk/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20180705234946.png" alt="案例">
  <img src="https://posts-1256188574.cos.ap-chengdu.myqcloud.com/luyhmk/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20180706023928.png">
</body>
</html>
`;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvY29uc3VtZXJzL2VwbmV4L3Rlc3RzL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsa0JBQWU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0NBaUVkLENBQUEifQ==