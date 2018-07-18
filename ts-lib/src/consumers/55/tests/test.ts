import Coin55 from '../55';
import Koa from '../../../lib/koa';
import Mongo from '../../../lib/mongo/';
import reverseConf from '../../../conf/reverseProxyConf';
import { log, getRandomInt } from '../../../lib/utils';

let mongo = new Mongo();

let running = {};

new Koa([
  {
    method: 'get',
    path: '/',
    cb: async (ctx) :Promise<any> => {
      let { code = '' } = ctx.query;
      log('数据接收到!');
      if (code.length !== 5) {
        return ctx.body = '邀请码有问题';
      }
      if (running[code]) {
        ctx.body = '已经添加, 无需重复添加!';
      } else {
        let count = 0;
        running[code] = true;
        task(code, count);
        ctx.body = '添加成功';
      }
      log('数据写入完成!');
    }
  }
]).listen(reverseConf.coin55.port, function() {
  log('e:\t', arguments);
  log(`在端口${reverseConf.coin55.port}侦听成功!`);
});


function task(code, count) {
  let randTime = getRandomInt(10, 2) as number * 1000 * 60;
  let c55 = new Coin55(code);
  c55.task(count);
  log(`下一次将在${randTime / 1000 / 60} 分钟后运行!`);
  if (count++ < 50) {
    setTimeout(() => { task(code, count); }, randTime);
  } else {
    running[code] = false;
  }
}


