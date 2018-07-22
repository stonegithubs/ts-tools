import OKF from '../okf';
import MyKoa from '../../../lib/koa';
import { portConf } from '../../../conf/reverseProxyConf';
import { log, getRandomStr } from '../../../lib/utils';

let okfContainer = {}

new MyKoa([
    {
        path: '/captcha',
        method: 'get',
        cb: async ctx => {
            let okf = new OKF();
            let seed = getRandom();
            let data = await okf.getCaptcha();
            if (data) {
                okfContainer[seed] = okf;
                ctx.body = { ...data, status: 1, seed };
            } else {
                ctx.body = { status: 0, data };
            }
        }
    },
    {
        path: '/captcha',
        method: 'post',
        cb: async ctx => {
            let { seed } = ctx.request.body;
            let okf = okfContainer[seed];
            delete okfContainer[seed];
            ctx.body = { status: 1, msg: '提交成功！' };
            okf.task(ctx.request.body);
        }
    }
], __dirname + '/../statics/').listen(portConf.OKF.port, () => {
    log(`在${portConf.OKF.port}端口启动成功！`);
});


function getRandom() {
    do {
        let str = getRandomStr(30, 30);
        if (!okfContainer[str]) return str;
    } while (true);
}