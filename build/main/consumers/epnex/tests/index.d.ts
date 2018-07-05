declare const _default: "\n<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <meta http-equiv=\"X-UA-Compatible\" content=\"ie=edge\">\n  <title>Document</title>\n  <style>\n    label{\n      display: block;\n    }\n    input {\n      border: 1px solid #eee;\n    }\n    .tip{\n      color: #f00;\n    }\n    button{\n      display: block;\n      margin: auto;\n    }\n  </style>\n</head>\n<body>\n  <form action=\"/t\" method=\"post\">\n    <label for=\"yqm\">\n      邀请码(或者邀请链接): <input type=\"text\" name='yqm'>\n    </label>\n    <label for=\"count\">\n     邀请次数: <input type=\"text\" name='count' value=\"20\">\n    </label>\n    <label for=\"inviteCode\">\n      脚本注册码: <input type=\"text\" name='inviteCode' value=\"\">\n    </label>\n    <label for=\"interval\">\n     注册频率(单位:分钟): <input type=\"text\" style=\"width:200px;\" name='interval' value=\"\" placeholder=\"此项可不填,则随机2-10分钟注册一次\">\n   </label>\n   <br>\n    <button type=\"submit\">提交</button>\n  </form>\n <br>\n   <p class=\"tip\">tip: 请提交之后几分钟查看是否注册成功</p>\n <br>\n  后期可开放查看邀请注册的所有记录的账号、密码、验证手机号\n</body>\n</html>\n";
export default _default;
