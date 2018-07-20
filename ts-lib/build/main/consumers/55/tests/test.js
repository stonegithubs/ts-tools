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
resume();
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
    utils_1.log(`在端口${reverseProxyConf_1.default.coin55.port}侦听成功!`);
});
async function task(code, count) {
    let randTime = utils_1.getRandomInt(10, 2) * 1000 * 60;
    let c55 = new _55_1.default(code);
    c55.task(count);
    let runningCol = await mongo.getCollection('55', 'running');
    utils_1.log(`下一次将在${randTime / 1000 / 60} 分钟后运行!`);
    if (count++ < 50) {
        setTimeout(() => { task(code, count); }, randTime);
        runningCol.updateOne({ code }, { $set: { count } }, { upsert: true });
    }
    else {
        running[code] = false;
        runningCol.deleteOne({ code });
    }
}
async function resume() {
    let runningCol = await mongo.getCollection('55', 'running');
    runningCol.find().forEach(el => {
        running[el.code] = true;
        task(el.code, el.count);
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9jb25zdW1lcnMvNTUvdGVzdHMvdGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLGdEQUEyQjtBQUMzQiwyREFBbUM7QUFDbkMsZ0VBQXdDO0FBQ3hDLHNGQUF5RDtBQUN6RCw4Q0FBdUQ7QUFFdkQsSUFBSSxLQUFLLEdBQUcsSUFBSSxlQUFLLEVBQUUsQ0FBQztBQUV4QixJQUFJLE9BQU8sR0FBRyxFQUFFLENBQUM7QUFDakIsTUFBTSxFQUFFLENBQUM7QUFFVCxJQUFJLGFBQUcsQ0FBQztJQUNOO1FBQ0UsTUFBTSxFQUFFLEtBQUs7UUFDYixJQUFJLEVBQUUsR0FBRztRQUNULEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFnQixFQUFFO1lBQzlCLElBQUksRUFBRSxJQUFJLEdBQUcsRUFBRSxFQUFFLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQztZQUM5QixXQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDZCxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO2dCQUNyQixPQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFDO2FBQzVCO1lBQ0QsSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ2pCLEdBQUcsQ0FBQyxJQUFJLEdBQUcsZUFBZSxDQUFDO2FBQzVCO2lCQUFNO2dCQUNMLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztnQkFDZCxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDO2dCQUNyQixJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUNsQixHQUFHLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQzthQUNuQjtZQUNELFdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNqQixDQUFDO0tBQ0Y7Q0FDRixDQUFDLENBQUMsTUFBTSxDQUFDLDBCQUFXLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRTtJQUNqQyxXQUFHLENBQUMsTUFBTSwwQkFBVyxDQUFDLE1BQU0sQ0FBQyxJQUFJLE9BQU8sQ0FBQyxDQUFDO0FBQzVDLENBQUMsQ0FBQyxDQUFDO0FBR0gsS0FBSyxlQUFlLElBQUksRUFBRSxLQUFLO0lBQzdCLElBQUksUUFBUSxHQUFHLG9CQUFZLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBVyxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7SUFDekQsSUFBSSxHQUFHLEdBQUcsSUFBSSxhQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDM0IsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNoQixJQUFJLFVBQVUsR0FBRyxNQUFNLEtBQUssQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQzVELFdBQUcsQ0FBQyxRQUFRLFFBQVEsR0FBRyxJQUFJLEdBQUcsRUFBRSxTQUFTLENBQUMsQ0FBQztJQUMzQyxJQUFJLEtBQUssRUFBRSxHQUFHLEVBQUUsRUFBRTtRQUNoQixVQUFVLENBQUMsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUNuRCxVQUFVLENBQUMsU0FBUyxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxLQUFLLEVBQUUsRUFBQyxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7S0FDdEU7U0FBTTtRQUNMLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUM7UUFDdEIsVUFBVSxDQUFDLFNBQVMsQ0FBQyxFQUFDLElBQUksRUFBQyxDQUFDLENBQUM7S0FDOUI7QUFDSCxDQUFDO0FBRUQsS0FBSztJQUNILElBQUksVUFBVSxHQUFHLE1BQU0sS0FBSyxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDNUQsVUFBVSxDQUFDLElBQUksRUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsRUFBRTtRQUM3QixPQUFPLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQztRQUN4QixJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDMUIsQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDIn0=