import ZK from '../zk';


import Koa from '../../../lib/koa';
import Mongo from '../../../lib/mongo/';
import reverseConf from '../../../conf/reverseProxyConf';
import { log, getRandomInt } from '../../../lib/utils';

let mongo = new Mongo();
let max = 100;
let running = {}

new Koa([
    {
        method: 'get',
        path: '/',
        cb: async (ctx): Promise<any> => {
            let { code = '' } = ctx.query;
            let count = 0;
            if (running[code]) {
                ctx.body = '请勿重复添加！';
            } else {
                run(code, count);
                running[code] = true;
                ctx.body = '添加成功！';
            }
        }
    }
]).listen(reverseConf.ZK.port, function () {
    log(`在端口${reverseConf.ZK.port}侦听成功!`);
});


function run(code, count): void {
    count++;
    if (count > max) {
        running[code] = false;
        return;
    }
    let zk = new ZK(code);
    zk.task(count);
    let randTime = 3000000;
    log(`${randTime / 1000 / 60}分钟以后执行下一次操作`, 'warn');
    setTimeout(() => {
        run(code, count);
    }, randTime);
}