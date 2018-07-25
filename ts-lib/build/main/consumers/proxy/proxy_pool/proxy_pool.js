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
        let chekcParallelCount = 400; // 一次检测1000条
        let count = 0;
        let queue = [];
        while (await cursor.hasNext()) {
            count++;
            queue.push(await cursor.next());
            if (queue.length >= chekcParallelCount || !await cursor.hasNext()) {
                utils_1.log(`从${count}条开始检测\t`, 'warn');
                let success = await this.doCheck(queue);
                utils_1.log(`检测成功, 共\t${queue.length}\t条, 成功\t${success}\t条!`, 'warn');
                queue = [];
            }
        }
        utils_1.log(`检测全部完成, 共 \t${count} \t条`, 'warn');
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
                    col.updateOne(el, Object.assign({}, el, { checked: true }));
                    count++;
                }
                else {
                    utils_1.log('checker 失败', data, 'warn');
                    col.deleteOne(el);
                }
            }
            catch (error) {
                utils_1.log('checker 异常', error, 'error');
                col.deleteOne(el);
            }
        }));
        return count;
    }
}
exports.default = ProxyPoll;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJveHlfcG9vbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9jb25zdW1lcnMvcHJveHkvcHJveHlfcG9vbC9wcm94eV9wb29sLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQ0EsK0RBQXVDO0FBQ3ZDLDhDQUFpRztBQUVqRyxtRUFBeUM7QUFDekMsa0VBQXlDO0FBRXpDLCtCQUErQjtBQUUvQixNQUFNLEtBQUssR0FBRyxJQUFJLGVBQUssRUFBRSxDQUFDO0FBRTFCO0lBQ0UsWUFBcUIsT0FBTyxFQUFFLEdBQUcsRUFBRSwwQkFBMEIsRUFBRTtRQUExQyxTQUFJLEdBQUosSUFBSSxDQUFzQztJQUFHLENBQUM7SUFDbkUsSUFBSTtRQUNGLElBQUksRUFBRSxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUM7UUFDcEIsdUJBQVksQ0FBQyxJQUFJLENBQUMsbUJBQW1CLEVBQUUsSUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFO1lBQ2pELEdBQUcsQ0FBQyxDQUFDLENBQUMsV0FBRyxDQUFDLGdCQUFnQixFQUFFLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBRyxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFDdEUsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBQ0QsS0FBSyxDQUFDLE9BQU87UUFDWCxJQUFJLEdBQUcsR0FBRyxNQUFNLEtBQUssQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3ZELElBQUksTUFBTSxHQUFHLE1BQU0sR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQzlCLElBQUksa0JBQWtCLEdBQUcsR0FBRyxDQUFDLENBQUMsWUFBWTtRQUMxQyxJQUFJLEtBQUssR0FBRyxDQUFDLENBQUM7UUFDZCxJQUFJLEtBQUssR0FBRyxFQUFFLENBQUM7UUFDZixPQUFNLE1BQU0sTUFBTSxDQUFDLE9BQU8sRUFBRSxFQUFFO1lBQzVCLEtBQUssRUFBRSxDQUFDO1lBQ1IsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1lBQ2hDLElBQUksS0FBSyxDQUFDLE1BQU0sSUFBSSxrQkFBa0IsSUFBSSxDQUFDLE1BQU0sTUFBTSxDQUFDLE9BQU8sRUFBRSxFQUFFO2dCQUNqRSxXQUFHLENBQUMsSUFBSSxLQUFLLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztnQkFDaEMsSUFBSSxPQUFPLEdBQUcsTUFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUN4QyxXQUFHLENBQUMsWUFBWSxLQUFLLENBQUMsTUFBTSxZQUFZLE9BQU8sTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO2dCQUMvRCxLQUFLLEdBQUcsRUFBRSxDQUFDO2FBQ1o7U0FDRjtRQUNELFdBQUcsQ0FBQyxlQUFlLEtBQUssTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQzFDLENBQUM7SUFFRCxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sR0FBRyxFQUFFO1FBQ3hCLElBQUksR0FBRyxHQUFHLE1BQU0sS0FBSyxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDdkQsSUFBSSxNQUFNLEdBQUcsTUFBTSxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDOUIsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ2QsTUFBTSxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFDLEVBQUUsRUFBQyxFQUFFO1lBQ3ZDLElBQUksRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsQ0FBQztZQUNoQyxJQUFJO2dCQUNGLElBQUksSUFBSSxHQUFHLE1BQU0saUJBQUssQ0FBQyxPQUFPLENBQUMsdUJBQXVCLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLFFBQVEsTUFBTSxFQUFFLElBQUksSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO2dCQUM3RyxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7b0JBQ2YsS0FBSztvQkFDTCxXQUFHLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxDQUFDO29CQUN4QixHQUFHLENBQUMsU0FBUyxDQUFDLEVBQUUsb0JBQU8sRUFBRSxJQUFFLE9BQU8sRUFBRSxJQUFJLElBQUcsQ0FBQztvQkFDNUMsS0FBSyxFQUFFLENBQUM7aUJBQ1Q7cUJBQU07b0JBQ0wsV0FBRyxDQUFDLFlBQVksRUFBRSxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7b0JBQ2hDLEdBQUcsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUM7aUJBQ25CO2FBQ0Y7WUFBQyxPQUFPLEtBQUssRUFBRTtnQkFDZCxXQUFHLENBQUMsWUFBWSxFQUFFLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDbEMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQzthQUNuQjtRQUNILENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDSixPQUFPLEtBQUssQ0FBQztJQUNmLENBQUM7Q0FDRjtBQW5ERCw0QkFtREMifQ==