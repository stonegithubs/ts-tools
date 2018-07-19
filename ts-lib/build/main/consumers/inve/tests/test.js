"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const inve_1 = __importDefault(require("../inve"));
const koa_1 = __importDefault(require("../../../lib/koa"));
const mongo_1 = __importDefault(require("../../../lib/mongo/"));
const reverseProxyConf_1 = __importDefault(require("../../../conf/reverseProxyConf"));
const utils_1 = require("../../../lib/utils");
const dbName = 'inve';
let mongo = new mongo_1.default();
let running = {};
resume();
new koa_1.default([
    {
        method: 'get',
        path: '/',
        cb: async (ctx) => {
            let { code = '', rc: runCode } = ctx.query;
            utils_1.log('数据接收到!');
            if (code.length !== 16) {
                return ctx.body = '邀请码有问题';
            }
            if (running[code]) {
                ctx.body = '已经添加, 无需重复添加!';
            }
            else if (runCode) {
                let count = 0;
                if (await task(code, runCode, count)) {
                    running[code] = true;
                    ctx.body = '添加成功';
                }
                else {
                    ctx.body = '缺少runCode';
                }
            }
            else {
                ctx.body = '参数不完整';
            }
            utils_1.log('数据写入完成!');
        }
    }
]).listen(reverseProxyConf_1.default.INVE.port, function () {
    utils_1.log('e:\t', arguments);
    utils_1.log(`在端口${reverseProxyConf_1.default.INVE.port}侦听成功!`);
});
async function task(code, runCode, count) {
    let randTime = utils_1.getRandomInt(10, 2) * 1000 * 60;
    if (!await checkPermission(runCode)) {
        // running[code] = false;
        return false;
    }
    else {
        let inve = new inve_1.default(code);
        inve.task(count);
        let runningCol = await mongo.getCollection(dbName, 'running');
        utils_1.log(`下一次将在${randTime / 1000 / 60} 分钟后运行!`);
        if (count++ < 50) {
            setTimeout(() => { task(code, runCode, count); }, randTime);
            runningCol.updateOne({ code, runCode }, { $set: { count } }, { upsert: true });
        }
        else {
            running[code] = false;
            runningCol.deleteOne({ code });
        }
    }
    return true;
}
async function resume() {
    let runningCol = await mongo.getCollection(dbName, 'running');
    runningCol.find().forEach(async (el) => {
        if (await task(el.code, el.runCode, el.count)) {
            running[el.code] = true;
        }
    });
}
async function checkPermission(runCode) {
    let col = await mongo.getCollection(dbName, 'runCode');
    let codeList = await col.find().toArray();
    for (let index = 0, len = codeList.length; index < len; index++) {
        const element = codeList[index];
        let { code, remain } = element;
        if (code === runCode) {
            if (remain-- > 0) {
                col.updateOne({ code }, { $set: { remain } });
                return true;
            }
            else {
                utils_1.log('runCode已用完!', 'error');
                return false;
            }
        }
    }
}
function a() {
    var i = 0;
    do {
        i++;
        console.log('tag 外', i);
        tag: {
            i += 2;
            console.log('tag 内', i);
            break tag;
        }
    } while (i < 10);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9jb25zdW1lcnMvaW52ZS90ZXN0cy90ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsbURBQTJCO0FBRzNCLDJEQUFtQztBQUNuQyxnRUFBd0M7QUFDeEMsc0ZBQXlEO0FBQ3pELDhDQUF1RDtBQUV2RCxNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUM7QUFFdEIsSUFBSSxLQUFLLEdBQUcsSUFBSSxlQUFLLEVBQUUsQ0FBQztBQUV4QixJQUFJLE9BQU8sR0FBRyxFQUFFLENBQUM7QUFHakIsTUFBTSxFQUFFLENBQUM7QUFHVCxJQUFJLGFBQUcsQ0FBQztJQUNOO1FBQ0UsTUFBTSxFQUFFLEtBQUs7UUFDYixJQUFJLEVBQUUsR0FBRztRQUNULEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFnQixFQUFFO1lBQzlCLElBQUksRUFBRSxJQUFJLEdBQUcsRUFBRSxFQUFFLEVBQUUsRUFBRSxPQUFPLEVBQUUsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDO1lBQzNDLFdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNkLElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxFQUFFLEVBQUU7Z0JBQ3RCLE9BQU8sR0FBRyxDQUFDLElBQUksR0FBRyxRQUFRLENBQUM7YUFDNUI7WUFDRCxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDakIsR0FBRyxDQUFDLElBQUksR0FBRyxlQUFlLENBQUM7YUFDNUI7aUJBQU0sSUFBRyxPQUFPLEVBQUU7Z0JBQ2pCLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztnQkFDZCxJQUFJLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsS0FBSyxDQUFDLEVBQUU7b0JBQ3BDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUM7b0JBRXJCLEdBQUcsQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFD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