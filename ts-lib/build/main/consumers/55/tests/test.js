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
    c55.task(count);
    utils_1.log(`下一次将在${randTime / 1000 / 60} 分钟后运行!`);
    if (count++ < 50) {
        setTimeout(() => { task(code, count); }, randTime);
    }
    else {
        running[code] = false;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9jb25zdW1lcnMvNTUvdGVzdHMvdGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLGdEQUEyQjtBQUMzQiwyREFBbUM7QUFDbkMsZ0VBQXdDO0FBQ3hDLHNGQUF5RDtBQUN6RCw4Q0FBdUQ7QUFFdkQsSUFBSSxLQUFLLEdBQUcsSUFBSSxlQUFLLEVBQUUsQ0FBQztBQUV4QixJQUFJLE9BQU8sR0FBRyxFQUFFLENBQUM7QUFFakIsSUFBSSxhQUFHLENBQUM7SUFDTjtRQUNFLE1BQU0sRUFBRSxLQUFLO1FBQ2IsSUFBSSxFQUFFLEdBQUc7UUFDVCxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBZ0IsRUFBRTtZQUM5QixJQUFJLEVBQUUsSUFBSSxHQUFHLEVBQUUsRUFBRSxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUM7WUFDOUIsV0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ2QsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtnQkFDckIsT0FBTyxHQUFHLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQzthQUM1QjtZQUNELElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUNqQixHQUFHLENBQUMsSUFBSSxHQUFHLGVBQWUsQ0FBQzthQUM1QjtpQkFBTTtnQkFDTCxJQUFJLEtBQUssR0FBRyxDQUFDLENBQUM7Z0JBQ2QsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQztnQkFDckIsSUFBSSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFDbEIsR0FBRyxDQUFDLElBQUksR0FBRyxNQUFNLENBQUM7YUFDbkI7WUFDRCxXQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDakIsQ0FBQztLQUNGO0NBQ0YsQ0FBQyxDQUFDLE1BQU0sQ0FBQywwQkFBVyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUU7SUFDakMsV0FBRyxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQztJQUN2QixXQUFHLENBQUMsTUFBTSwwQkFBVyxDQUFDLE1BQU0sQ0FBQyxJQUFJLE9BQU8sQ0FBQyxDQUFDO0FBQzVDLENBQUMsQ0FBQyxDQUFDO0FBR0gsY0FBYyxJQUFJLEVBQUUsS0FBSztJQUN2QixJQUFJLFFBQVEsR0FBRyxvQkFBWSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQVcsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO0lBQ3pELElBQUksR0FBRyxHQUFHLElBQUksYUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzNCLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDaEIsV0FBRyxDQUFDLFFBQVEsUUFBUSxHQUFHLElBQUksR0FBRyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQzNDLElBQUksS0FBSyxFQUFFLEdBQUcsRUFBRSxFQUFFO1FBQ2hCLFVBQVUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0tBQ3BEO1NBQU07UUFDTCxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDO0tBQ3ZCO0FBQ0gsQ0FBQyJ9