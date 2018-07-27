"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zk_1 = __importDefault(require("../zk"));
const koa_1 = __importDefault(require("../../../lib/koa"));
const mongo_1 = __importDefault(require("../../../lib/mongo/"));
const reverseProxyConf_1 = __importDefault(require("../../../conf/reverseProxyConf"));
const utils_1 = require("../../../lib/utils");
const task_namespace_1 = require("../../../lib/utils/task.namespace");
let mongo = new mongo_1.default();
let max = 100;
let running = {};
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
                task_namespace_1.Task.dayAndNight(run.bind(null, args), {
                    loop: max,
                    dayEndHour: 24,
                    fnStopCb: () => {
                        running[code] = false;
                    }
                });
                running[code] = true;
                ctx.body = '添加成功！';
            }
        }
    }
]).listen(reverseProxyConf_1.default.ZK.port, function () {
    utils_1.log(`在端口${reverseProxyConf_1.default.ZK.port}侦听成功!`);
});
function run(params) {
    let zk = new zk_1.default(params.code);
    params.count++;
    zk.task(params.count);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9jb25zdW1lcnMvemsvdGVzdHMvdGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLCtDQUF1QjtBQUd2QiwyREFBbUM7QUFDbkMsZ0VBQXdDO0FBQ3hDLHNGQUF5RDtBQUN6RCw4Q0FBdUQ7QUFDdkQsc0VBQXlEO0FBRXpELElBQUksS0FBSyxHQUFHLElBQUksZUFBSyxFQUFFLENBQUM7QUFDeEIsSUFBSSxHQUFHLEdBQUcsR0FBRyxDQUFDO0FBQ2QsSUFBSSxPQUFPLEdBQUcsRUFBRSxDQUFBO0FBRWhCLElBQUksYUFBRyxDQUFDO0lBQ0o7UUFDSSxNQUFNLEVBQUUsS0FBSztRQUNiLElBQUksRUFBRSxHQUFHO1FBQ1QsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQWdCLEVBQUU7WUFDNUIsSUFBSSxFQUFFLElBQUksR0FBRyxFQUFFLEVBQUUsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDO1lBQzlCLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUNmLEdBQUcsQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDO2FBQ3hCO2lCQUFNO2dCQUNILElBQUksSUFBSSxHQUFHLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsQ0FBQztnQkFDOUIscUJBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEVBQUU7b0JBQ25DLElBQUksRUFBRSxHQUFHO29CQUNULFVBQVUsRUFBRSxFQUFFO29CQUNkLFFBQVEsRUFBRSxHQUFHLEVBQUU7d0JBQ1gsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQztvQkFDMUIsQ0FBQztpQkFDSixDQUFDLENBQUE7Z0JBQ0YsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQztnQkFDckIsR0FBRyxDQUFDLElBQUksR0FBRyxPQUFPLENBQUM7YUFDdEI7UUFDTCxDQUFDO0tBQ0o7Q0FDSixDQUFDLENBQUMsTUFBTSxDQUFDLDBCQUFXLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRTtJQUMzQixXQUFHLENBQUMsTUFBTSwwQkFBVyxDQUFDLEVBQUUsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxDQUFDO0FBQzFDLENBQUMsQ0FBQyxDQUFDO0FBRUgsYUFBYSxNQUFNO0lBQ2YsSUFBSSxFQUFFLEdBQUcsSUFBSSxZQUFFLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzdCLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUNmLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzFCLENBQUMifQ==