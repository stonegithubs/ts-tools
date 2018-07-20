import Coin55 from '../55';
import Koa from '../../../lib/koa';
import Mongo from '../../../lib/mongo/';
import reverseConf from '../../../conf/reverseProxyConf';
import { log, getRandomInt } from '../../../lib/utils';

let mongo = new Mongo();


async function bulkMock() {
  let col = await mongo.getCollection('55', 'regists');
  col.find().forEach(item => {
    let randTime = getRandomInt(10) as number * 1000 ;
    log(`将在${randTime/1000/60}分钟之后执行!`, 'error');
    setTimeout(async () => {
      let c55 = new Coin55(item.code);
      await c55.login(item.phone, item.password);
    }, randTime);
  })
}

bulkMock();