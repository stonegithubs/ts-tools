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
    utils_1.log('e:\t', arguments);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9jb25zdW1lcnMvNTUvdGVzdHMvdGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLGdEQUEyQjtBQUMzQiwyREFBbUM7QUFDbkMsZ0VBQXdDO0FBQ3hDLHNGQUF5RDtBQUN6RCw4Q0FBdUQ7QUFFdkQsSUFBSSxLQUFLLEdBQUcsSUFBSSxlQUFLLEVBQUUsQ0FBQztBQUV4QixJQUFJLE9BQU8sR0FBRyxFQUFFLENBQUM7QUFDakIsTUFBTSxFQUFFLENBQUM7QUFFVCxJQUFJLGFBQUcsQ0FBQztJQUNOO1FBQ0UsTUFBTSxFQUFFLEtBQUs7UUFDYixJQUFJLEVBQUUsR0FBRztRQUNULEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFnQixFQUFFO1lBQzlCLElBQUksRUFBRSxJQUFJLEdBQUcsRUFBRSxFQUFFLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQztZQUM5QixXQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDZCxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO2dCQUNyQixPQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFDO2FBQzVCO1lBQ0QsSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ2pCLEdBQUcsQ0FBQyxJQUFJLEdBQUcsZUFBZSxDQUFDO2FBQzVCO2lCQUFNO2dCQUNMLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztnQkFDZCxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDO2dCQUNyQixJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO2dCQUNsQixHQUFHLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQzthQUNuQjtZQUNELFdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUNqQixDQUFDO0tBQ0Y7Q0FDRixDQUFDLENBQUMsTUFBTSxDQUFDLDBCQUFXLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRTtJQUNqQyxXQUFHLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQ3ZCLFdBQUcsQ0FBQyxNQUFNLDBCQUFXLENBQUMsTUFBTSxDQUFDLElBQUksT0FBTyxDQUFDLENBQUM7QUFDNUMsQ0FBQyxDQUFDLENBQUM7QUFHSCxLQUFLLGVBQWUsSUFBSSxFQUFFLEtBQUs7SUFDN0IsSUFBSSxRQUFRLEdBQUcsb0JBQVksQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFXLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQztJQUN6RCxJQUFJLEdBQUcsR0FBRyxJQUFJLGFBQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMzQixHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2hCLElBQUksVUFBVSxHQUFHLE1BQU0sS0FBSyxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDNUQsV0FBRyxDQUFDLFFBQVEsUUFBUSxHQUFHLElBQUksR0FBRyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQzNDLElBQUksS0FBSyxFQUFFLEdBQUcsRUFBRSxFQUFFO1FBQ2hCLFVBQVUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ25ELFVBQVUsQ0FBQyxTQUFTLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLEtBQUssRUFBRSxFQUFDLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztLQUN0RTtTQUFNO1FBQ0wsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQztRQUN0QixVQUFVLENBQUMsU0FBUyxDQUFDLEVBQUMsSUFBSSxFQUFDLENBQUMsQ0FBQztLQUM5QjtBQUNILENBQUM7QUFFRCxLQUFLO0lBQ0gsSUFBSSxVQUFVLEdBQUcsTUFBTSxLQUFLLENBQUMsYUFBYSxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztJQUM1RCxVQUFVLENBQUMsSUFBSSxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxFQUFFO1FBQzdCLE9BQU8sQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBQ3hCLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMxQixDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMifQ==