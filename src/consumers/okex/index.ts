import Okex from './stratege1';
import Koa from '../../lib/koa';

let users = {} as any;

new Koa([
    {
      method: 'get', path: '/run', cb: (ctx) => {
          let { key, secret, stop, coinFrom = 'okb', coinTo = 'usdt' } = ctx.query;
          if (key && secret) {
              let user = key + '|' + secret;
              if (users[user]) {
                  if (stop) {
                    users[user].stop();
                    users[user] = undefined;
                    ctx.body = '已停止！';
                  } else {
                    ctx.body = '用户已经添加， 无需重复添加！';
                  }
              } else {
                 let okex = new Okex(key, secret);
                 users[user] = okex;
                 okex.wsLogin();
                 okex.task(coinFrom, coinTo, '1min');
                 ctx.body = '用户添加成功！';
              }
          } else {
              ctx.body = '必须传入 key 和 secret！';
          }
      }
    }
  ]).listen(8887);