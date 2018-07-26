import ZK from '../zk';


import Koa from '../../../lib/koa';
import Mongo from '../../../lib/mongo/';
import reverseConf from '../../../conf/reverseProxyConf';
import { log, getRandomInt } from '../../../lib/utils';
import { Task } from '../../../lib/utils/task.namespace';

let mongo = new Mongo();
let max = 100;
let running = {}

new Koa([
    {
        method: 'get',
        path: '/',
        cb: async (ctx): Promise<any> => {
            let { code = '' } = ctx.query;
            if (running[code]) {
                ctx.body = '请勿重复添加！';
            } else {
                Task.dayAndNight(run.bind(null, code), {
                    loop: max,
                    dayEndHour: 24,
                    fnStopCb: () => {
                        running[code] = false;
                    }
                })
                running[code] = true;
                ctx.body = '添加成功！';
            }
        }
    }
]).listen(reverseConf.ZK.port, function () {
    log(`在端口${reverseConf.ZK.port}侦听成功!`);
});

function run(code): void {
    let zk = new ZK(code);
    zk.task();
}
