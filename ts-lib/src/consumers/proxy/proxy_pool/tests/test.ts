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
      let cursor = await col.find(queryDoc).sort({ lastCheckTime : +sort }).limit(+count).skip(+begin);
      ctx.body = await stripDuplicates(cursor);
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


async function stripDuplicates(cursor) {
  let proxyPool = {};
  let col = await mongo.getCollection(dbName, colName);
  return new Promise((res, rej) => {
    cursor.forEach(el => {  // 去重处理, 使用 cursor 可以节省内存
      let { protocol, ip, port } = el;
      let key = `${protocol}://${ip}:${port}`;
      if (proxyPool[key]) {
        col.deleteOne(el);
      } else {
        proxyPool[key] = el;
      }
    }, err => {
      if (err) {
        rej({ status: 0, count: 0, data: err });
      } else {
        let data = Object.values(proxyPool);
        res({ status: 1, count: data.length, data });
      }
    })
  })
}
