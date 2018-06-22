import Manbi from './stratege1';
import Koa from '../../lib/koa';

let users = [];

new Koa([
    {
      method: 'get', path: '/run', cb: (ctx) => {
          let { apiid, secret } = ctx.query;
          if (apiid && secret) {
              let user = apiid + '|' + secret;
              if (~users.indexOf(user)) {
                ctx.body = '用户已经添加， 无需重复添加！'
              } else {
                  new Manbi(apiid, secret).run();
                 users.push(user);
                 ctx.body = '用户添加成功！'
              }
          } else {
              ctx.body = '必须传入 apiid 和 secret！'
          }
      }
    }
  ]).listen(3000);