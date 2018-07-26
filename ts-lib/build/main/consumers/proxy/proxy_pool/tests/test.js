"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_1 = __importDefault(require("../../../../lib/koa"));
const mongo_1 = __importDefault(require("../../../../lib/mongo/"));
const reverseProxyConf_1 = __importDefault(require("../../../../conf/reverseProxyConf"));
const utils_1 = require("../../../../lib/utils");
const proxy_pool_1 = __importDefault(require("../proxy_pool"));
const dbName = 'proxy';
const colName = 'proxys';
const userName = 'lakdf;llkjqw23134lk12j;L:KJFDLK#:LEJE)(*_(_)#';
const password = 'askdfkjllskfdj23lk4jl;12341lk2jl241234ljk12l';
let mongo = new mongo_1.default();
let proxy = new proxy_pool_1.default();
loop(); // 开始爬取代理和可用性检测循环
new koa_1.default([
    {
        path: '/proxies',
        method: 'get',
        cb: async (ctx) => {
            let { count = 100, begin = 0, protocol, sort = -1, u, p } = ctx.query;
            if (u === userName && p === password) {
                let col = await mongo.getCollection(dbName, colName);
                let queryDoc = {
                    [protocol && 'protocol']: protocol,
                    lastCheckTime: { $exists: true }
                };
                let cursor = await col.find(queryDoc).sort({ lastCheckTime: +sort }).limit(+count).skip(+begin);
                ctx.body = await proxy.stripDuplicates(cursor);
            }
            else {
                ctx.body = { status: 0, data: '用户名密码错误' };
            }
        }
    },
    {
        path: '/proxies',
        method: 'delete',
        cb: async (ctx) => {
            let { _id } = ctx.query;
            let col = await mongo.getCollection(dbName, colName);
            let data = await col.deleteOne({ _id });
            ctx.body = {
                status: 1,
                data
            };
        }
    }
]).listen(reverseProxyConf_1.default.ProxyPool.port, () => {
    utils_1.log(`在端口${reverseProxyConf_1.default.ProxyPool.port}侦听成功!`);
});
async function loop() {
    do {
        try {
            await proxy.task();
        }
        catch (error) {
            utils_1.log('循环出错!', error, 'error');
        }
    } while (true);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9jb25zdW1lcnMvcHJveHkvcHJveHlfcG9vbC90ZXN0cy90ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsOERBQXNDO0FBQ3RDLG1FQUEyQztBQUMzQyx5RkFBNEQ7QUFDNUQsaURBQTBEO0FBQzFELCtEQUFzQztBQUV0QyxNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUM7QUFDdkIsTUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDO0FBQ3pCLE1BQU0sUUFBUSxHQUFHLCtDQUErQyxDQUFDO0FBQ2pFLE1BQU0sUUFBUSxHQUFHLDhDQUE4QyxDQUFDO0FBRWhFLElBQUksS0FBSyxHQUFHLElBQUksZUFBSyxFQUFFLENBQUM7QUFDeEIsSUFBSSxLQUFLLEdBQUcsSUFBSSxvQkFBUyxFQUFFLENBQUM7QUFDNUIsSUFBSSxFQUFFLENBQUMsQ0FBRSxpQkFBaUI7QUFFMUIsSUFBSSxhQUFHLENBQUM7SUFDTjtRQUNFLElBQUksRUFBRSxVQUFVO1FBQ2hCLE1BQU0sRUFBRSxLQUFLO1FBQ2IsRUFBRSxFQUFFLEtBQUssRUFBQyxHQUFHLEVBQUMsRUFBRTtZQUNkLElBQUksRUFBRSxLQUFLLEdBQUcsR0FBRyxFQUFFLEtBQUssR0FBRyxDQUFDLEVBQUUsUUFBUSxFQUFFLElBQUksR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQztZQUN0RSxJQUFJLENBQUMsS0FBSyxRQUFRLElBQUksQ0FBQyxLQUFLLFFBQVEsRUFBRTtnQkFDcEMsSUFBSSxHQUFHLEdBQUcsTUFBTSxLQUFLLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDckQsSUFBSSxRQUFRLEdBQUc7b0JBQ2IsQ0FBQyxRQUFRLElBQUksVUFBVSxDQUFDLEVBQUUsUUFBUTtvQkFDbEMsYUFBYSxFQUFFLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRTtpQkFDakMsQ0FBQztnQkFDRixJQUFJLE1BQU0sR0FBRyxNQUFNLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsYUFBYSxFQUFHLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDakcsR0FBRyxDQUFDLElBQUksR0FBRyxNQUFNLEtBQUssQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUM7YUFDaEQ7aUJBQU07Z0JBQ0wsR0FBRyxDQUFDLElBQUksR0FBRyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxDQUFDO2FBQzNDO1FBQ0gsQ0FBQztLQUNGO0lBQ0Q7UUFDRSxJQUFJLEVBQUUsVUFBVTtRQUNoQixNQUFNLEVBQUUsUUFBUTtRQUNoQixFQUFFLEVBQUUsS0FBSyxFQUFDLEdBQUcsRUFBQyxFQUFFO1lBQ2QsSUFBSSxFQUFFLEdBQUcsRUFBRSxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUM7WUFDeEIsSUFBSSxHQUFHLEdBQUcsTUFBTSxLQUFLLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztZQUNyRCxJQUFJLElBQUksR0FBRyxNQUFNLEdBQUcsQ0FBQyxTQUFTLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBQ3hDLEdBQUcsQ0FBQyxJQUFJLEdBQUc7Z0JBQ1QsTUFBTSxFQUFFLENBQUM7Z0JBQ1QsSUFBSTthQUNMLENBQUE7UUFDSCxDQUFDO0tBQ0Y7Q0FDRixDQUFDLENBQUMsTUFBTSxDQUFDLDBCQUFXLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUU7SUFDekMsV0FBRyxDQUFDLE1BQU0sMEJBQVcsQ0FBQyxTQUFTLENBQUMsSUFBSSxPQUFPLENBQUMsQ0FBQztBQUMvQyxDQUFDLENBQUMsQ0FBQztBQUVILEtBQUs7SUFDSCxHQUFHO1FBQ0QsSUFBSTtZQUNGLE1BQU0sS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO1NBQ3BCO1FBQUMsT0FBTyxLQUFLLEVBQUU7WUFDZCxXQUFHLENBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztTQUM5QjtLQUNGLFFBQVEsSUFBSSxFQUFFO0FBQ2pCLENBQUMifQ==