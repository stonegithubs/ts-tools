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
const task_namespace_1 = require("../../../lib/utils/task.namespace");
let mongo = new mongo_1.default();
let maxCount = 140;
let running = {};
resume();
new koa_1.default([
    {
        method: 'get',
        path: '/',
        cb: async (ctx) => {
            let { code = '', stop = '' } = ctx.query;
            utils_1.log('数据接收到!');
            if (stop) {
                running[code] = false;
                let runningCol = await mongo.getCollection('55', 'running');
                runningCol.updateOne({ code }, { $set: { count: maxCount + 1 } });
            }
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
]).listen(reverseProxyConf_1.default.COIN_55.port, function () {
    utils_1.log(`在端口${reverseProxyConf_1.default.COIN_55.port}侦听成功!`);
});
async function task(code, count) {
    let runningCol = await mongo.getCollection('55', 'running');
    task_namespace_1.Task.dayAndNight(() => {
        let c55 = new _55_1.default(code);
        c55.task(count++);
        runningCol.updateOne({ code }, { $inc: { count: 1 } }, { upsert: true });
    }, {
        loop: maxCount,
        msDayMin: 50000,
        msDayMax: 80000,
        msNightMin: 50000,
        msNightMax: 80000,
        fnStop: () => {
            if (new Date().getHours() === 0) {
                return true; // 凌晨截止
            }
            else {
                return hasNoPermission(code);
            }
        },
        fnStopCb: () => {
            running[code] = false;
            runningCol.deleteOne({ code });
        }
    });
}
async function hasNoPermission(code) {
    let runningCol = await mongo.getCollection('55', 'running');
    let runItem = await runningCol.findOne({ code });
    return !(runItem ? runItem.count < maxCount : true);
}
async function resume() {
    let runningCol = await mongo.getCollection('55', 'running');
    runningCol.find().forEach(el => {
        running[el.code] = true;
        task(el.code, el.count);
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9jb25zdW1lcnMvNTUvdGVzdHMvdGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLGdEQUEyQjtBQUMzQiwyREFBbUM7QUFDbkMsZ0VBQXdDO0FBQ3hDLHNGQUF5RDtBQUN6RCw4Q0FBdUQ7QUFDdkQsc0VBQXlEO0FBRXpELElBQUksS0FBSyxHQUFHLElBQUksZUFBSyxFQUFFLENBQUM7QUFDeEIsSUFBSSxRQUFRLEdBQUcsR0FBRyxDQUFDO0FBQ25CLElBQUksT0FBTyxHQUFHLEVBQUUsQ0FBQztBQUNqQixNQUFNLEVBQUUsQ0FBQztBQUVULElBQUksYUFBRyxDQUFDO0lBQ047UUFDRSxNQUFNLEVBQUUsS0FBSztRQUNiLElBQUksRUFBRSxHQUFHO1FBQ1QsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQWdCLEVBQUU7WUFDOUIsSUFBSSxFQUFFLElBQUksR0FBRyxFQUFFLEVBQUUsSUFBSSxHQUFHLEVBQUUsRUFBRSxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUM7WUFDekMsV0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ2QsSUFBSSxJQUFJLEVBQUU7Z0JBQ1IsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQztnQkFDdEIsSUFBSSxVQUFVLEdBQUcsTUFBTSxLQUFLLENBQUMsYUFBYSxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztnQkFDNUQsVUFBVSxDQUFDLFNBQVMsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsS0FBSyxFQUFFLFFBQVEsR0FBRyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7YUFDbkU7WUFDRCxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO2dCQUNyQixPQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFDO2FBQzVCO1lBQ0QsSUFB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