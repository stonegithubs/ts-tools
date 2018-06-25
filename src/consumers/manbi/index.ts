import Koa from '../../lib/koa';
import Manbi from './strategy1';

let users = {} as any;

new Koa([
    {
      method: 'get', path: '/run', cb: (ctx) => {
          let { apiid, secret, buyNum, sellNum, disparityLimit, timelimit, taskInterval, stop } = ctx.query;
          if (apiid && secret) {
              let user = apiid + '|' + secret;
              if (users[user]) {
                  if (stop) {
                    users[user].stop();
                    users[user] = undefined;
                    ctx.body = '已停止！';
                  } else {
                    ctx.body = '用户已经添加， 无需重复添加！';
                  }
              } else {
                 let manbi = new Manbi(apiid, secret, buyNum, sellNum, disparityLimit, timelimit, taskInterval);
                 users[user] = manbi;
                 manbi.run();
                 ctx.body = '用户添加成功！';
              }
          } else {
              ctx.body = '必须传入 apiid 和 secret！';
          }
      }
    }
  ]).listen(8888);