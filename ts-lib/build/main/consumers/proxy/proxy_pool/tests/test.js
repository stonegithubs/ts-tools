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
loopAlive(); // 循环检测一次可用性
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
        utils_1.log('task 开始', 'warn');
        try {
            await proxy.task();
        }
        catch (error) {
            utils_1.log('循环出错!', error, 'error');
        }
    } while (true);
}
async function loopAlive() {
    do {
        await proxy.checkAlive();
    } while (await utils_1.wait(10000, true)); // 循环间隔 10s 检测一次可用性
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9jb25zdW1lcnMvcHJveHkvcHJveHlfcG9vbC90ZXN0cy90ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsOERBQXNDO0FBQ3RDLG1FQUEyQztBQUMzQyx5RkFBNEQ7QUFDNUQsaURBQWdFO0FBQ2hFLCtEQUFzQztBQUV0QyxNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUM7QUFDdkIsTUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDO0FBQ3pCLE1BQU0sUUFBUSxHQUFHLCtDQUErQyxDQUFDO0FBQ2pFLE1BQU0sUUFBUSxHQUFHLDhDQUE4QyxDQUFDO0FBRWhFLElBQUksS0FBSyxHQUFHLElBQUksZUFBSyxFQUFFLENBQUM7QUFDeEIsSUFBSSxLQUFLLEdBQUcsSUFBSSxvQkFBUyxFQUFFLENBQUM7QUFDNUIsSUFBSSxFQUFFLENBQUMsQ0FBRSxpQkFBaUI7QUFDMUIsU0FBUyxFQUFFLENBQUMsQ0FBRSxZQUFZO0FBRTFCLElBQUksYUFBRyxDQUFDO0lBQ047UUFDRSxJQUFJLEVBQUUsVUFBVTtRQUNoQixNQUFNLEVBQUUsS0FBSztRQUNiLEVBQUUsRUFBRSxLQUFLLEVBQUMsR0FBRyxFQUFDLEVBQUU7WUFDZCxJQUFJLEVBQUUsS0FBSyxHQUFHLEdBQUcsRUFBRSxLQUFLLEdBQUcsQ0FBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUM7WUFDdEUsSUFBSSxDQUFDLEtBQUssUUFBUSxJQUFJLENBQUMsS0FBSyxRQUFRLEVBQUU7Z0JBQ3BDLElBQUksR0FBRyxHQUFHLE1BQU0sS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7Z0JBQ3JELElBQUksUUFBUSxHQUFHO29CQUNiLENBQUMsUUFBUSxJQUFJLFVBQVUsQ0FBQyxFQUFFLFFBQVE7b0JBQ2xDLGFBQWEsRUFBRSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUU7aUJBQ2pDLENBQUM7Z0JBQ0YsSUFBSSxNQUFNLEdBQUcsTUFBTSxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLGFBQWEsRUFBRyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ2pHLEdBQUcsQ0FBQyxJQUFJLEdBQUcsTUFBTSxLQUFLLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2FBQ2hEO2lCQUFNO2dCQUNMLEdBQUcsQ0FBQyxJQUFJLEdBQUcsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsQ0FBQzthQUMzQztRQUNILENBQUM7S0FDRjtJQUNEO1FBQ0UsSUFBSSxFQUFFLFVBQVU7UUFDaEIsTUFBTSxFQUFFLFFBQVE7UUFDaEIsRUFBRSxFQUFFLEtBQUssRUFBQyxHQUFHLEVBQUMsRUFBRTtZQUNkLElBQUksRUFBRSxHQUFHLEVBQUUsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDO1lBQ3hCLElBQUksR0FBRyxHQUFHLE1BQU0sS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDckQsSUFBSSxJQUFJLEdBQUcsTUFBTSxHQUFHLENBQUMsU0FBUyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztZQUN4QyxHQUFHLENBQUMsSUFBSSxHQUFHO2dCQUNULE1BQU0sRUFBRSxDQUFDO2dCQUNULElBQUk7YUFDTCxDQUFBO1FBQ0gsQ0FBQztLQUNGO0NBQ0YsQ0FBQyxDQUFDLE1BQU0sQ0FBQywwQkFBVyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLFdBQUcsQ0FBQyxNQUFNLDBCQUFXLENBQUMsU0FBUyxDQUFDLElBQUksT0FBTyxDQUFDLENBQUM7QUFDL0MsQ0FBQyxDQUFDLENBQUM7QUFFSCxLQUFLO0lBQ0gsR0FBRztRQUNELFdBQUcsQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDdkIsSUFBSTtZQUNGLE1BQU0sS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO1NBQ3BCO1FBQUMsT0FBTyxLQUFLLEVBQUU7WUFDZCxXQUFHLENBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztTQUM5QjtLQUNGLFFBQVEsSUFBSSxFQUFFO0FBQ2pCLENBQUM7QUFFRCxLQUFLO0lBQ0gsR0FBRztRQUNELE1BQU0sS0FBSyxDQUFDLFVBQVUsRUFBRSxDQUFDO0tBQzFCLFFBQVEsTUFBTSxZQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxFQUFFLENBQUUsbUJBQW1CO0FBQ3pELENBQUMifQ==