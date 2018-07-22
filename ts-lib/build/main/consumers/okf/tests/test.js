"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const okf_1 = __importDefault(require("../okf"));
const koa_1 = __importDefault(require("../../../lib/koa"));
const reverseProxyConf_1 = require("../../../conf/reverseProxyConf");
const utils_1 = require("../../../lib/utils");
let okfContainer = {};
new koa_1.default([
    {
        path: '/captcha',
        method: 'get',
        cb: async (ctx) => {
            let okf = new okf_1.default();
            let seed = getRandom();
            let data = await okf.getCaptcha();
            if (data) {
                okfContainer[seed] = okf;
                ctx.body = Object.assign({}, data, { status: 1, seed });
            }
            else {
                ctx.body = { status: 0, data };
            }
        }
    },
    {
        path: '/captcha',
        method: 'post',
        cb: async (ctx) => {
            let { seed } = ctx.request.body;
            let okf = okfContainer[seed];
            delete okfContainer[seed];
            ctx.body = { status: 1, msg: '提交成功！' };
            okf.task(ctx.request.body);
        }
    }
], __dirname + '/../statics/').listen(reverseProxyConf_1.portConf.OKF.port, () => {
    utils_1.log(`在${reverseProxyConf_1.portConf.OKF.port}端口启动成功！`);
});
function getRandom() {
    do {
        let str = utils_1.getRandomStr(30, 30);
        if (!okfContainer[str])
            return str;
    } while (true);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9jb25zdW1lcnMvb2tmL3Rlc3RzL3Rlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxpREFBeUI7QUFDekIsMkRBQXFDO0FBQ3JDLHFFQUEwRDtBQUMxRCw4Q0FBdUQ7QUFFdkQsSUFBSSxZQUFZLEdBQUcsRUFBRSxDQUFBO0FBRXJCLElBQUksYUFBSyxDQUFDO0lBQ047UUFDSSxJQUFJLEVBQUUsVUFBVTtRQUNoQixNQUFNLEVBQUUsS0FBSztRQUNiLEVBQUUsRUFBRSxLQUFLLEVBQUMsR0FBRyxFQUFDLEVBQUU7WUFDWixJQUFJLEdBQUcsR0FBRyxJQUFJLGFBQUcsRUFBRSxDQUFDO1lBQ3BCLElBQUksSUFBSSxHQUFHLFNBQVMsRUFBRSxDQUFDO1lBQ3ZCLElBQUksSUFBSSxHQUFHLE1BQU0sR0FBRyxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBQ2xDLElBQUksSUFBSSxFQUFFO2dCQUNOLFlBQVksQ0FBQyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUM7Z0JBQ3pCLEdBQUcsQ0FBQyxJQUFJLHFCQUFRLElBQUksSUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLElBQUksR0FBRSxDQUFDO2FBQzNDO2lCQUFNO2dCQUNILEdBQUcsQ0FBQyxJQUFJLEdBQUcsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDO2FBQ2xDO1FBQ0wsQ0FBQztLQUNKO0lBQ0Q7UUFDSSxJQUFJLEVBQUUsVUFBVTtRQUNoQixNQUFNLEVBQUUsTUFBTTtRQUNkLEVBQUUsRUFBRSxLQUFLLEVBQUMsR0FBRyxFQUFDLEVBQUU7WUFDWixJQUFJLEVBQUUsSUFBSSxFQUFFLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7WUFDaEMsSUFBSSxHQUFHLEdBQUcsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzdCLE9BQU8sWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzFCLEdBQUcsQ0FBQyxJQUFJLEdBQUcsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQUUsQ0FBQztZQUN2QyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDL0IsQ0FBQztLQUNKO0NBQ0osRUFBRSxTQUFTLEdBQUcsY0FBYyxDQUFDLENBQUMsTUFBTSxDQUFDLDJCQUFRLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUU7SUFDMUQsV0FBRyxDQUFDLElBQUksMkJBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxTQUFTLENBQUMsQ0FBQztBQUN4QyxDQUFDLENBQUMsQ0FBQztBQUdIO0lBQ0ksR0FBRztRQUNDLElBQUksR0FBRyxHQUFHLG9CQUFZLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQy9CLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDO1lBQUUsT0FBTyxHQUFHLENBQUM7S0FDdEMsUUFBUSxJQUFJLEVBQUU7QUFDbkIsQ0FBQyJ9