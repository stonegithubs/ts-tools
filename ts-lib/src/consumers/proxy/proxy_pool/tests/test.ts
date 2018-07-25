import Koa from '../../../../lib/koa';
import Mongo from '../../../../lib/mongo/';
import reverseConf from '../../../../conf/reverseProxyConf';
import { log, getRandomInt } from '../../../../lib/utils';
import ProxyPoll from '../proxy_pool';

const dbName = 'proxy';
const colName = 'proxys';

let mongo = new Mongo();
let cursor;
let proxy = new ProxyPoll();

new Koa([
  {
    path: '/proxies',
    method: 'get',
    cb: async ctx => {
      let { count = 100, begin = 0, protocol, sort = -1 } = ctx.query;
      let col = await mongo.getCollection(dbName, colName);
      let queryDoc = {
        [protocol && 'protocol']: protocol,
        lastCheckTime: { $exists: true }
      };
      let data = await col.find(queryDoc).sort({ lastCheckTime : +sort }).limit(+count).skip(+begin).toArray();
      ctx.body = {
        status: 1,
        count: data.length,
        data
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

// 爬取新数据
proxy.task();
setInterval(() => {
  proxy.task();
}, 1000 * 60 * 30);  // 30 分钟更新一次数据库

// 检测新数据
setInterval(() => {
  proxy.checker();
}, 1000 * 60 * 20);  // 20 分钟检测一次代理的可用性

