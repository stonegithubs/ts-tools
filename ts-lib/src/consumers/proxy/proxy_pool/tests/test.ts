import Koa from '../../../../lib/koa';
import Mongo from '../../../../lib/mongo/';
import reverseConf from '../../../../conf/reverseProxyConf';
import { log, getRandomInt, wait } from '../../../../lib/utils';
import ProxyPool from '../proxy_pool';

const dbName = 'proxy';
const colName = 'proxys';
const userName = 'lakdf;llkjqw23134lk12j;L:KJFDLK#:LEJE)(*_(_)#';
const password = 'askdfkjllskfdj23lk4jl;12341lk2jl241234ljk12l';

let mongo = new Mongo();
let proxy = new ProxyPool();
loop();  // 开始爬取代理和可用性检测循环
loopAlive();  // 循环检测一次可用性

new Koa([
  {
    path: '/proxies',
    method: 'get',
    cb: async ctx => {
      let { count = 100, begin = 0, protocol, sort = -1, u, p } = ctx.query;
      if (u === userName && p === password) {
        let col = await mongo.getCollection(dbName, colName);
        let queryDoc = {
          [protocol && 'protocol']: protocol,
          lastCheckTime: { $exists: true }
        };
        let cursor = await col.find(queryDoc).sort({ lastCheckTime : +sort }).limit(+count).skip(+begin);
        ctx.body = await proxy.stripDuplicates(cursor);
      } else {
        ctx.body = { status: 0, data: '用户名密码错误' };
      }
    }
  },
  {
    path: '/proxies',
    method: 'delete',
    cb: async ctx => {
      let { _id } = ctx.query;
      let col = await mongo.getCollection(dbName, colName);
      let data = await col.deleteOne({ _id });
      ctx.body = {
        status: 1,
        data
      }
    }
  }
]).listen(reverseConf.ProxyPool.port, () => {
  log(`在端口${reverseConf.ProxyPool.port}侦听成功!`);
});

async function loop() {
  do {
    log('task 开始', 'warn');
    try {
      await proxy.task();
    } catch (error) {
      log('循环出错!', error, 'error');
    }
  } while (true);
}

async function loopAlive() {
  do {
    await proxy.checkAlive();
  } while (await wait(10000, true));  // 循环间隔 10s 检测一次可用性
}
