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
let mongo = new mongo_1.default();
let max = 100;
let running = {};
new koa_1.default([
    {
        method: 'get',
        path: '/',
        cb: async (ctx) => {
            let { code = '' } = ctx.query;
            let count = 0;
            if (running[code]) {
                ctx.body = '请勿重复添加！';
            }
            else {
                run(code, count);
                running[code] = true;
                ctx.body = '添加成功！';
            }
        }
    }
]).listen(reverseProxyConf_1.default.ZK.port, function () {
    utils_1.log(`在端口${reverseProxyConf_1.default.ZK.port}侦听成功!`);
});
function run(code, count) {
    count++;
    if (count > max) {
        running[code] = false;
        return;
    }
    let zk = new zk_1.default(code);
    zk.task(count);
    let randTime = 3000000;
    utils_1.log(`${randTime / 1000 / 60}分钟以后执行下一次操作`, 'warn');
    setTimeout(() => {
        run(code, count);
    }, randTime);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9jb25zdW1lcnMvemsvdGVzdHMvdGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLCtDQUF1QjtBQUd2QiwyREFBbUM7QUFDbkMsZ0VBQXdDO0FBQ3hDLHNGQUF5RDtBQUN6RCw4Q0FBdUQ7QUFFdkQsSUFBSSxLQUFLLEdBQUcsSUFBSSxlQUFLLEVBQUUsQ0FBQztBQUN4QixJQUFJLEdBQUcsR0FBRyxHQUFHLENBQUM7QUFDZCxJQUFJLE9BQU8sR0FBRyxFQUFFLENBQUE7QUFFaEIsSUFBSSxhQUFHLENBQUM7SUFDSjtRQUNJLE1BQU0sRUFBRSxLQUFLO1FBQ2IsSUFBSSxFQUFFLEdBQUc7UUFDVCxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBZ0IsRUFBRTtZQUM1QixJQUFJLEVBQUUsSUFBSSxHQUFHLEVBQUUsRUFBRSxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUM7WUFDOUIsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO1lBQ2QsSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ2YsR0FBRyxDQUFDLElBQUksR0FBRyxTQUFTLENBQUM7YUFDeEI7aUJBQU07Z0JBQ0gsR0FBRyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFDakIsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQztnQkFDckIsR0FBRyxDQUFDLElBQUksR0FBRyxPQUFPLENBQUM7YUFDdEI7UUFDTCxDQUFDO0tBQ0o7Q0FDSixDQUFDLENBQUMsTUFBTSxDQUFDLDBCQUFXLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRTtJQUMzQixXQUFHLENBQUMsTUFBTSwwQkFBVyxDQUFDLEVBQUUsQ0FBQyxJQUFJLE9BQU8sQ0FBQyxDQUFDO0FBQzFDLENBQUMsQ0FBQyxDQUFDO0FBR0gsYUFBYSxJQUFJLEVBQUUsS0FBSztJQUNwQixLQUFLLEVBQUUsQ0FBQztJQUNSLElBQUksS0FBSyxHQUFHLEdBQUcsRUFBRTtRQUNiLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUM7UUFDdEIsT0FBTztLQUNWO0lBQ0QsSUFBSSxFQUFFLEdBQUcsSUFBSSxZQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDdEIsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNmLElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQztJQUN2QixXQUFHLENBQUMsR0FBRyxRQUFRLEdBQUcsSUFBSSxHQUFHLEVBQUUsYUFBYSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ2xELFVBQVUsQ0FBQyxHQUFHLEVBQUU7UUFDWixHQUFHLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ3JCLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztBQUNqQixDQUFDIn0=