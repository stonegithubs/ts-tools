"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongo_1 = __importDefault(require("../../../lib/mongo"));
const utils_1 = require("../../../lib/utils");
const request_1 = __importDefault(require("../../../lib/request"));
const child_process_1 = __importDefault(require("child_process"));
//  --------- MongoDB ---------
const mongo = new mongo_1.default();
class ProxyPoll {
    constructor(conf = { cwd: '/zhangjianjun/proxy_pool' }) {
        this.conf = conf;
    }
    task() {
        let { conf } = this;
        child_process_1.default.exec('python3 start.py;', conf, err => {
            err ? utils_1.log('执行proxy_pool出错', err, 'error') : utils_1.log('执行 proxy_pool 完成');
        });
    }
    async checker() {
        let col = await mongo.getCollection('proxy', 'proxys');
        let cursor = await col.find();
        let chekcParallelCount = 1000; // 一次检测1000条
        let queue = [];
        while (cursor.hasNext()) {
            queue.push(cursor.next());
            if (queue.length >= chekcParallelCount || !cursor.hasNext()) {
                let success = await this.doCheck(queue);
                utils_1.log(`成功${success}条!`, 'warn');
            }
        }
    }
    async doCheck(proxies = []) {
        let col = await mongo.getCollection('proxy', 'proxys');
        let cursor = await col.find();
        let count = 0;
        await Promise.all(proxies.map(async (el) => {
            let { protocol, ip, port } = el;
            try {
                let data = await request_1.default.getJson('http://httpbin.org/ip', {}, 'get', { proxy: `${protocol}://${ip}:${port}` });
                if (data.origin) {
                    // OK
                    utils_1.log('checker 成功', data);
                    count++;
                }
                else {
                    utils_1.log('checker 失败', data, 'warn');
                    col.deleteOne(el);
                }
            }
            catch (error) {
                utils_1.log('checker 异常', error, 'error');
            }
        }));
        return count;
    }
}
exports.default = ProxyPoll;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJveHlfcG9vbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9jb25zdW1lcnMvcHJveHkvcHJveHlfcG9vbC9wcm94eV9wb29sLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQ0EsK0RBQXVDO0FBQ3ZDLDhDQUFpRztBQUVqRyxtRUFBeUM7QUFDekMsa0VBQXlDO0FBRXpDLCtCQUErQjtBQUUvQixNQUFNLEtBQUssR0FBRyxJQUFJLGVBQUssRUFBRSxDQUFDO0FBRTFCO0lBQ0UsWUFBcUIsT0FBTyxFQUFFLEdBQUcsRUFBRSwwQkFBMEIsRUFBRTtRQUExQyxTQUFJLEdBQUosSUFBSSxDQUFzQztJQUFHLENBQUM7SUFDbkUsSUFBSTtRQUNGLElBQUksRUFBRSxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUM7UUFDcEIsdUJBQVksQ0FBQyxJQUFJLENBQUMsbUJBQW1CLEVBQUUsSUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFO1lBQ2pELEdBQUcsQ0FBQyxDQUFDLENBQUMsV0FBRyxDQUFDLGdCQUFnQixFQUFFLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBRyxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFDdEUsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBQ0QsS0FBSyxDQUFDLE9BQU87UUFDWCxJQUFJLEdBQUcsR0FBRyxNQUFNLEtBQUssQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3ZELElBQUksTUFBTSxHQUFHLE1BQU0sR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQzlCLElBQUksa0JBQWtCLEdBQUcsSUFBSSxDQUFDLENBQUMsWUFBWTtRQUMzQyxJQUFJLEtBQUssR0FBRyxFQUFFLENBQUM7UUFDZixPQUFNLE1BQU0sQ0FBQyxPQUFPLEVBQUUsRUFBRTtZQUN0QixLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1lBQzFCLElBQUksS0FBSyxDQUFDLE1BQU0sSUFBSSxrQkFBa0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsRUFBRTtnQkFDM0QsSUFBSSxPQUFPLEdBQUcsTUFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUN4QyxXQUFHLENBQUMsS0FBSyxPQUFPLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQzthQUMvQjtTQUNGO0lBQ0gsQ0FBQztJQUVELEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxHQUFHLEVBQUU7UUFDeEIsSUFBSSxHQUFHLEdBQUcsTUFBTSxLQUFLLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztRQUN2RCxJQUFJLE1BQU0sR0FBRyxNQUFNLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUM5QixJQUFJLEtBQUssR0FBRyxDQUFDLENBQUM7UUFDZCxNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUMsRUFBRSxFQUFDLEVBQUU7WUFDdkMsSUFBSSxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDO1lBQ2hDLElBQUk7Z0JBQ0YsSUFBSSxJQUFJLEdBQUcsTUFBTSxpQkFBSyxDQUFDLE9BQU8sQ0FBQyx1QkFBdUIsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsUUFBUSxNQUFNLEVBQUUsSUFBSSxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7Z0JBQzdHLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtvQkFDZixLQUFLO29CQUNMLFdBQUcsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLENBQUM7b0JBQ3hCLEtBQUssRUFBRSxDQUFDO2lCQUNUO3FCQUFNO29CQUNMLFdBQUcsQ0FBQyxZQUFZLEVBQUUsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO29CQUNoQyxHQUFHLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2lCQUNuQjthQUNGO1lBQUMsT0FBTyxLQUFLLEVBQUU7Z0JBQ2QsV0FBRyxDQUFDLFlBQVksRUFBRSxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7YUFDbkM7UUFDSCxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ0osT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDO0NBQ0Y7QUE1Q0QsNEJBNENDIn0=