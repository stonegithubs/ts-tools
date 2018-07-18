import Koa from '../../lib/koa';
import Mongo from '../../lib/mongo/';
import reverseConf from '../../conf/reverseProxyConf';
import { log } from '../../lib/utils';

let mongo = new Mongo();

new Koa([
  {
    method: 'get',
    path: '/surveies',
    cb: async ctx => {
      log('数据接收到!');
      ctx.body = '111111';
      log('数据写入完成!');
    }
  },
  {
    method: 'post',
    path: '/surveies',
    cb: async ctx => {
      let survey = ctx.request.body;
      log('数据接收到!');
      let col = await mongo.getCollection('survey', 'survey')
      let result = await col.insertOne(survey);
      ctx.body = result.result;
      log('数据写入完成!', result);
    }
  }
]).listen(reverseConf.survey.port, () => {
  log(`在端口${reverseConf.survey.port}侦听成功!`);
});

