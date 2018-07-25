import Koa from '../../../../lib/koa';
import Mongo from '../../../../lib/mongo/';
import reverseConf from '../../../../conf/reverseProxyConf';
import { log, getRandomInt } from '../../../../lib/utils';

const dbName = 'proxy';
const colName = 'proxys';

let mongo = new Mongo();
let cursor;


new Koa([
  {
    path: '/proxies',
    method: 'get',
    cb: async ctx => {
      let { count = 100, begin = 0 } = ctx.query;
      let col = await mongo.getCollection(dbName, colName);
      let data = await col.find().limit(+count).skip(+begin).toArray();
      ctx.body = {
        status: 1,
        data
      }
    }
  }
]).listen(reverseConf.ProxyPool.port, () => {
  log(`在端口${reverseConf.ProxyPool.port}侦听成功!`);
});