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
            err && utils_1.log('执行proxy_pool出错', err, 'error');
        });
    }
    async checker() {
        let col = await mongo.getCollection('proxy', 'proxys');
        let cursor = await col.find();
        cursor.forEach(async (el) => {
            let data = await request_1.default.getJson('http://httpbin.org/ip');
            if (data.origin) {
                // OK
            }
            else {
                col.deleteOne(el);
            }
        });
    }
}
exports.default = ProxyPoll;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJveHlfcG9vbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9jb25zdW1lcnMvcHJveHkvcHJveHlfcG9vbC9wcm94eV9wb29sLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQ0EsK0RBQXVDO0FBQ3ZDLDhDQUFpRztBQUVqRyxtRUFBeUM7QUFDekMsa0VBQXlDO0FBRXpDLCtCQUErQjtBQUUvQixNQUFNLEtBQUssR0FBRyxJQUFJLGVBQUssRUFBRSxDQUFDO0FBRTFCO0lBQ0UsWUFBcUIsT0FBTyxFQUFFLEdBQUcsRUFBRSwwQkFBMEIsRUFBRTtRQUExQyxTQUFJLEdBQUosSUFBSSxDQUFzQztJQUFHLENBQUM7SUFDbkUsSUFBSTtRQUNGLElBQUksRUFBRSxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUM7UUFDcEIsdUJBQVksQ0FBQyxJQUFJLENBQUMsbUJBQW1CLEVBQUUsSUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFO1lBQ2pELEdBQUcsSUFBSSxXQUFHLENBQUMsZ0JBQWdCLEVBQUUsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQzdDLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUNELEtBQUssQ0FBQyxPQUFPO1FBQ1gsSUFBSSxHQUFHLEdBQUcsTUFBTSxLQUFLLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztRQUN2RCxJQUFJLE1BQU0sR0FBRyxNQUFNLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUM5QixNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBQyxFQUFFLEVBQUMsRUFBRTtZQUN4QixJQUFJLElBQUksR0FBRyxNQUFNLGlCQUFLLENBQUMsT0FBTyxDQUFDLHVCQUF1QixDQUFDLENBQUM7WUFDeEQsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO2dCQUNmLEtBQUs7YUFDTjtpQkFBTTtnQkFDTCxHQUFHLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2FBQ25CO1FBQ0gsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDO0NBQ0Y7QUFwQkQsNEJBb0JDIn0=