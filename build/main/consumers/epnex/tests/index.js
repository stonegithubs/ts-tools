"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = `
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
    input {
      border: 1px solid #eee;
    }
    .tip{
      color: #f00;
    }
    button{
      display: block;
      margin: auto;
    }
  </style>
</head>
<body>
  <form action="/t" method="post">
    <label for="yqm">
      邀请码(或者邀请链接): <input type="text" name='yqm'>
    </label>
    <label for="count">
     邀请次数: <input type="text" name='count' value="20">
    </label>
    <label for="inviteCode">
      脚本注册码: <input type="text" name='inviteCode' value="">
    </label>
    <label for="interval">
     注册频率(单位:分钟): <input type="text" style="width:200px;" name='interval' value="" placeholder="此项可不填,则随机2-10分钟注册一次">
   </label>
   <br>
    <button type="submit">提交</button>
  </form>
 <br>
   <p class="tip">tip: 请提交之后几分钟查看是否注册成功</p>
 <br>
  后期可开放查看邀请注册的所有记录的账号、密码、验证手机号
</body>
</html>
`;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvY29uc3VtZXJzL2VwbmV4L3Rlc3RzL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsa0JBQWU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0NBK0NkLENBQUEifQ==