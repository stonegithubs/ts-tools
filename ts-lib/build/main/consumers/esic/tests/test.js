"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const esic_1 = __importDefault(require("../esic"));
const koa_1 = __importDefault(require("../../../lib/koa"));
const mongo_1 = __importDefault(require("../../../lib/mongo/"));
const reverseProxyConf_1 = __importDefault(require("../../../conf/reverseProxyConf"));
const utils_1 = require("../../../lib/utils");
const task_namespace_1 = require("../../../lib/utils/task.namespace");
const mongo = new mongo_1.default();
const dbName = 'esic';
const colName = 'running';
const max = 100;
const running = {};
resume();
new koa_1.default([
    {
        method: 'get',
        path: '/',
        cb: async (ctx) => {
            let { code = '' } = ctx.query;
            if (running[code]) {
                ctx.body = '请勿重复添加！';
            }
            else {
                let args = { code, count: 0 };
                addTask(args);
                running[code] = true;
                ctx.body = '添加成功！';
            }
        }
    }
]).listen(reverseProxyConf_1.default.ESIC.port, function () {
    utils_1.log(`在端口${reverseProxyConf_1.default.ESIC.port}侦听成功!`);
});
function addTask(args) {
    let { code } = args;
    task_namespace_1.Task.dayAndNight(run.bind(null, args), {
        loop: max,
        dayEndHour: 24,
        fnStop: async () => {
            const col = await mongo.getCollection(dbName, colName);
            const item = await col.findOne({ code });
            return item.count >= max;
        },
        fnStopCb: () => {
            running[code] = false;
        }
    });
}
function run(params) {
    const esic = new esic_1.default(params.code);
    params.count++;
    esic.task(params.count);
    storeRunningInfo(params.code);
}
async function storeRunningInfo(code) {
    const col = await mongo.getCollection(dbName, colName);
    const item = await col.findOne({ code });
    col.updateOne({ code }, { $inc: { count: 1 } }, { upsert: true });
}
async function resume() {
    const col = await mongo.getCollection(dbName, colName);
    col.find().forEach(el => {
        let code = el;
        addTask(el);
        running[code] = true;
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9jb25zdW1lcnMvZXNpYy90ZXN0cy90ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsbURBQTJCO0FBQzNCLDJEQUFtQztBQUNuQyxnRUFBd0M7QUFDeEMsc0ZBQXlEO0FBQ3pELDhDQUF1RDtBQUN2RCxzRUFBeUQ7QUFFekQsTUFBTSxLQUFLLEdBQUcsSUFBSSxlQUFLLEVBQUUsQ0FBQztBQUMxQixNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUM7QUFDdEIsTUFBTSxPQUFPLEdBQUcsU0FBUyxDQUFDO0FBQzFCLE1BQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQztBQUNoQixNQUFNLE9BQU8sR0FBRyxFQUFFLENBQUE7QUFFbEIsTUFBTSxFQUFFLENBQUM7QUFFVCxJQUFJLGFBQUcsQ0FBQztJQUNKO1FBQ0ksTUFBTSxFQUFFLEtBQUs7UUFDYixJQUFJLEVBQUUsR0FBRztRQUNULEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFnQixFQUFFO1lBQzVCLElBQUksRUFBRSxJQUFJLEdBQUcsRUFBRSxFQUFFLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQztZQUM5QixJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDZixHQUFHLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQzthQUN4QjtpQkFBTTtnQkFDSCxJQUFJLElBQUksR0FBRyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLENBQUM7Z0JBQzlCLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDZCxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDO2dCQUNyQixHQUFHLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQzthQUN0QjtRQUNMLENBQUM7S0FDSjtDQUNKLENBQUMsQ0FBQyxNQUFNLENBQUMsMEJBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFO0lBQzdCLFdBQUcsQ0FBQyxNQUFNLDBCQUFXLENBQUMsSUFBSSxDQUFDLElBQUksT0FBTyxDQUFDLENBQUM7QUFDNUMsQ0FBQyxDQUFDLENBQUM7QUFFSCxpQkFBaUIsSUFBSTtJQUNuQixJQUFJLEVBQUUsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDO0lBQ3BCLHFCQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxFQUFFO1FBQ3JDLElBQUksRUFBRSxHQUFHO1FBQ1QsVUFBVSxFQUFFLEVBQUU7UUFDZCxNQUFNLEVBQUUsS0FBSyxJQUFJLEVBQUU7WUFDakIsTUFBTSxHQUFHLEdBQUcsTUFBTSxLQUFLLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztZQUN2RCxNQUFNLElBQUksR0FBRyxNQUFNLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1lBQ3pDLE9BQU8sSUFBSSxDQUFDLEtBQUssSUFBSSxHQUFHLENBQUM7UUFDM0IsQ0FBQztRQUNELFFBQVEsRUFBRSxHQUFHLEVBQUU7WUFDWCxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDO1FBQzFCLENBQUM7S0FDRixDQUFDLENBQUE7QUFDSixDQUFDO0FBRUQsYUFBYSxNQUFNO0lBQ2YsTUFBTSxJQUFJLEdBQUcsSUFBSSxjQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ25DLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUNmLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3hCLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNsQyxDQUFDO0FBRUQsS0FBSywyQkFBMkIsSUFBSTtJQUNsQyxNQUFNLEdBQUcsR0FBRyxNQUFNLEtBQUssQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3ZELE1BQU0sSUFBSSxHQUFHLE1BQU0sR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7SUFDekMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFDLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUNuRSxDQUFDO0FBRUQsS0FBSztJQUNILE1BQU0sR0FBRyxHQUFHLE1BQU0sS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDdkQsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsRUFBRTtRQUN0QixJQUFJLElBQUksR0FBRyxFQUFFLENBQUM7UUFDZCxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDWixPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDO0lBQ3ZCLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyJ9