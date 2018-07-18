"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _55_1 = __importDefault(require("../55"));
const koa_1 = __importDefault(require("../../../lib/koa"));
const mongo_1 = __importDefault(require("../../../lib/mongo/"));
const reverseProxyConf_1 = __importDefault(require("../../../conf/reverseProxyConf"));
const utils_1 = require("../../../lib/utils");
let mongo = new mongo_1.default();
let running = {};
new koa_1.default([
    {
        method: 'get',
        path: '/',
        cb: async (ctx) => {
            let { code = '' } = ctx.query;
            utils_1.log('数据接收到!');
            if (code.length !== 5) {
                return ctx.body = '邀请码有问题';
            }
            if (running[code]) {
                ctx.body = '已经添加, 无需重复添加!';
            }
            else {
                let count = 0;
                running[code] = true;
                task(code, count);
                ctx.body = '添加成功';
            }
            utils_1.log('数据写入完成!');
        }
    }
]).listen(reverseProxyConf_1.default.coin55.port, function () {
    utils_1.log('e:\t', arguments);
    utils_1.log(`在端口${reverseProxyConf_1.default.coin55.port}侦听成功!`);
});
function task(code, count) {
    let randTime = utils_1.getRandomInt(10, 2) * 1000 * 60;
    let c55 = new _55_1.default(code);
    c55.task();
    utils_1.log(`下一次将在${randTime / 1000 / 60} 分钟后运行!`);
    if (count++ < 50) {
        setTimeout(() => { task(code, count); }, randTime);
    }
    else {
        running[code] = false;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9jb25zdW1lcnMvNTUvdGVzdHMvdGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLGdEQUEyQjtBQUMzQiwyREFBbUM7QUFDbkMsZ0VBQXdDO0FBQ3hDLHNGQUF5RDtBQUN6RCw4Q0FBdUQ7QUFFdkQsSUFBSSxLQUFLLEdBQUcsSUFBSSxlQUFLLEVBQUUsQ0FBQztBQUV4QixJQUFJLE9BQU8sR0FBRyxFQUFFLENBQUM7QUFFakIsSUFBSSxhQUFHLENBQUM7SUFDTjtRQUNFLE1BQU0sRUFBRSxLQUFLO1FBQ2IsSUFBSSxFQUFFLEdBQUc7UUFDVCxFQUFFLEVBQUUsS0FBSyxFQUFDLEdBQUcsRUFBQyxFQUFFO1lBQ2QsSUFBSSxFQUFFLElBQUksR0FBRyxFQUFFLEVBQUUsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDO1lBQzlCLFdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNkLElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7Z0JBQ3JCLE9BQU8sR0FBRyxDQUFDLElBQUksR0FBRyxRQUFRLENBQUM7YUFDNUI7WUFDRCxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDakIsR0FBRyxDQUFDLElBQUksR0FBRyxlQUFlLENBQUM7YUFDNUI7aUJBQU07Z0JBQ0wsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO2dCQUNkLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUM7Z0JBQ3JCLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7Z0JBQ2xCLEdBQUcsQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDO2FBQ25CO1lBQ0QsV0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ2pCLENBQUM7S0FDRjtDQUNGLENBQUMsQ0FBQyxNQUFNLENBQUMsMEJBQVcsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFO0lBQ2pDLFdBQUcsQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDdkIsV0FBRyxDQUFDLE1BQU0sMEJBQVcsQ0FBQyxNQUFNLENBQUMsSUFBSSxPQUFPLENBQUMsQ0FBQztBQUM1QyxDQUFDLENBQUMsQ0FBQztBQUdILGNBQWMsSUFBSSxFQUFFLEtBQUs7SUFDdkIsSUFBSSxRQUFRLEdBQUcsb0JBQVksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFXLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQztJQUN6RCxJQUFJLEdBQUcsR0FBRyxJQUFJLGFBQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMzQixHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDWCxXQUFHLENBQUMsUUFBUSxRQUFRLEdBQUcsSUFBSSxHQUFHLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDM0MsSUFBSSxLQUFLLEVBQUUsR0FBRyxFQUFFLEVBQUU7UUFDaEIsVUFBVSxDQUFDLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUM7S0FDcEQ7U0FBTTtRQUNMLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUM7S0FDdkI7QUFDSCxDQUFDIn0=