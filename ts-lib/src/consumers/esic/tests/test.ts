import ESIC from "../esic";
import Koa from '../../../lib/koa';
import Mongo from '../../../lib/mongo/';
import reverseConf from '../../../conf/reverseProxyConf';
import { log, getRandomInt } from '../../../lib/utils';
import { Task } from '../../../lib/utils/task.namespace';

const mongo = new Mongo();
const dbName = 'esic';
const colName = 'running';
const max = 100;
const running = {}

resume();

new Koa([
    {
        method: 'get',
        path: '/',
        cb: async (ctx): Promise<any> => {
            let { code = '' } = ctx.query;
            if (code.length != 6) {
                return ctx.body = { status: 0, msg: '邀请码不正确' };
            }
            if (running[code]) {
                ctx.body = '请勿重复添加！';
            } else {
                let args = { code, count: 0 };
                addTask(args);
                running[code] = true;
                ctx.body = '添加成功！';
            }
        }
    }
]).listen(reverseConf.ESIC.port, function () {
    log(`在端口${reverseConf.ESIC.port}侦听成功!`);
});

function addTask(args) {
  let { code } = args;
  Task.dayAndNight(run.bind(null, args), {
    loop: max,
    dayEndHour: 24,
    fnStop: async () => {
      const col = await mongo.getCollection(dbName, colName);
      const item = await col.findOne({ code });
      return item.count >= max;
    },
    fnStopCb: () => {
        running[code] = false;
    }
  })
}

function run(params): void {
    const esic = new ESIC(params.code);
    params.count++;
    esic.task(params.count);
    storeRunningInfo(params.code);
}

async function storeRunningInfo(code) {
  const col = await mongo.getCollection(dbName, colName);
  col.updateOne({ code }, { $inc: { count: 1 }}, { upsert: true });
}

async function resume() {
  const col = await mongo.getCollection(dbName, colName);
  col.find().forEach(el => {
    let { code } = el;
    addTask(el);
    running[code] = true;
  })
}