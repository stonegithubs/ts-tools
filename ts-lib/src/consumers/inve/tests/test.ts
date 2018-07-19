import INVE from "../inve";


import Koa from '../../../lib/koa';
import Mongo from '../../../lib/mongo/';
import reverseConf from '../../../conf/reverseProxyConf';
import { log, getRandomInt } from '../../../lib/utils';

const dbName = 'inve';

let mongo = new Mongo();

let running = {};


resume();


new Koa([
  {
    method: 'get',
    path: '/',
    cb: async (ctx) :Promise<any> => {
      let { code = '', rc: runCode } = ctx.query;
      log('数据接收到!');
      if (code.length !== 16) {
        return ctx.body = '邀请码有问题';
      }
      if (running[code]) {
        ctx.body = '已经添加, 无需重复添加!';
      } else if(runCode) {
        let count = 0;
        if (await task(code, runCode, count)) {
          running[code] = true;

          ctx.body = '添加成功';
        } else {
          ctx.body = '缺少runCode';
        }
      } else {
        ctx.body = '参数不完整';
      }
      log('数据写入完成!');
    }
  }
]).listen(reverseConf.INVE.port, function() {
  log('e:\t', arguments);
  log(`在端口${reverseConf.INVE.port}侦听成功!`);
});


async function task(code, runCode, count): Promise<any> {
  let randTime = getRandomInt(10, 2) as number * 1000 * 60;
  if (!await checkPermission(runCode)) {
    // running[code] = false;
    return false;
  } else {
    let inve = new INVE(code);
    inve.task(count);

    let runningCol = await mongo.getCollection(dbName, 'running');
    log(`下一次将在${randTime / 1000 / 60} 分钟后运行!`);
    if (count++ < 50) {
      setTimeout(() => { task(code, runCode, count); }, randTime);
      runningCol.updateOne({ code, runCode }, { $set: { count }}, { upsert: true });
    } else {
      running[code] = false;
      runningCol.deleteOne({code});
    }
  }
  return true;
}

async function resume(){
  let runningCol = await mongo.getCollection(dbName, 'running');
  runningCol.find().forEach(async el => {
    if (await task(el.code, el.runCode, el.count)){
      running[el.code] = true;
    }
  })
}

async function checkPermission(runCode: string):Promise<any> {
  let col = await mongo.getCollection(dbName, 'runCode');
  let codeList = await col.find().toArray();
  for (let index = 0, len = codeList.length; index < len; index++) {
    const element = codeList[index];
    let { code, remain } = element;
    if (code === runCode) {
      if (remain-- > 0) {
        col.updateOne({ code }, { $set: { remain }});
        return true;
      } else {
        log('runCode已用完!', 'error');
        return false;
      }
    }
  }
}



function a(){
  var i = 0;
  do {
    i++;
    console.log('tag 外', i)
    tag: {
      i+=2;
      console.log('tag 内', i);
      break tag;
    }
  } while (i<10);


}