import Koa from '../../lib/koa';
import Mongo from '../../lib/mongo/';
import reverseConf from '../../conf/reverseProxyConf';
import { log } from 'util';

let mongo = new Mongo();

new Koa([
  {
    method: 'post',
    path: '/serveies',
    cb: async ctx => {
      let survey = ctx.request.body;
      let col = await mongo.getCollection('survey', 'survey')
      let result = await col.insertOne(survey);
      ctx.body = result.result;
    }
  }
]).listen(reverseConf.survey.port);

