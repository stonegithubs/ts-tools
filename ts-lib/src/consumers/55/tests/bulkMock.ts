import Coin55 from '../55';
import Mongo from '../../../lib/mongo/';
import { log, getRandomInt } from '../../../lib/utils';

let mongo = new Mongo();


async function bulkMock() {
  let col = await mongo.getCollection('55', 'regists');
  col.find().forEach(item => {
    let randTime = getRandomInt(6 * 1000 * 60 * 60) as number;   // 6 小时之内执行完成
    log(`将在${randTime/1000/60}分钟之后执行!`, 'error');
    setTimeout(async () => {
      let c55 = new Coin55(item.code);
      await c55.login(item.phone, item.password);
      col.updateOne({ phone: item.phone }, {$inc: { mockTime: 1 }}, { upsert: true })
    }, randTime);
  })
}

bulkMock();

setInterval(bulkMock, 1000 * 60 * 60 * 22); // 22小时执行一次