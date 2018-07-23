import Coin55 from '../55';
import Koa from '../../../lib/koa';
import Mongo from '../../../lib/mongo/';
import reverseConf from '../../../conf/reverseProxyConf';
import { log, getRandomInt } from '../../../lib/utils';
import { Task } from '../../../lib/utils/task.namespace';

let mongo = new Mongo();
let maxCount = 140;
let running = {};
resume();

new Koa([
  {
    method: 'get',
    path: '/',
    cb: async (ctx) :Promise<any> => {
      let { code = '', stop = '' } = ctx.query;
      log('数据接收到!');
      if (stop) {
        running[code] = false;
        let runningCol = await mongo.getCollection('55', 'running');
        runningCol.updateOne({ code }, { $set: { count: maxCount + 1 } });
      }
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
]).listen(reverseConf.COIN_55.port, function() {
  log(`在端口${reverseConf.COIN_55.port}侦听成功!`);
});


async function task(code, count): Promise<any> {
  let runningCol = await mongo.getCollection('55', 'running');
  Task.dayAndNight(() => {
    let c55 = new Coin55(code);
    c55.task(count++);
    runningCol.updateOne({ code }, { $inc: { count: 1 }}, { upsert: true });
  }, {
    loop: maxCount,
    msNightMin: 120000,
    msNightMax: 600000,
    fnStop: () => {
      if (new Date().getHours() === 0) {
        return true;  // 凌晨截止
      } else {
        return hasNoPermission(code);
      }
    },
    fnStopCb: () => {
      running[code] = false;
      runningCol.deleteOne({ code });
    }
  })
}

async function hasNoPermission(code) {
  let runningCol = await mongo.getCollection('55', 'running');
  let runItem = await runningCol.findOne({code});
  return !(runItem ? runItem.count < maxCount : true);
}

async function resume(){
  let runningCol = await mongo.getCollection('55', 'running');
  runningCol.find().forEach(el => {
    running[el.code] = true;
    task(el.code, el.count);
  })
}
