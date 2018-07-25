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
let mongo = new mongo_1.default();
let cursor;
let proxy = new proxy_pool_1.default();
new koa_1.default([
    {
        path: '/proxies',
        method: 'get',
        cb: async (ctx) => {
            let { count = 100, begin = 0, protocol, sort = -1 } = ctx.query;
            let col = await mongo.getCollection(dbName, colName);
            let queryDoc = {
                [protocol && 'protocol']: protocol,
                lastCheckTime: { $exists: true }
            };
            let data = await col.find(queryDoc).sort({ lastCheckTime: +sort }).limit(+count).skip(+begin).toArray();
            ctx.body = {
                status: 1,
                count: data.length,
                data
            };
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
// 爬取新数据
proxy.task();
setInterval(() => {
    proxy.task();
}, 1000 * 60 * 30); // 30 分钟更新一次数据库
// 检测新数据
setInterval(() => {
    proxy.checker();
}, 1000 * 60 * 20); // 20 分钟检测一次代理的可用性
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9jb25zdW1lcnMvcHJveHkvcHJveHlfcG9vbC90ZXN0cy90ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsOERBQXNDO0FBQ3RDLG1FQUEyQztBQUMzQyx5RkFBNEQ7QUFDNUQsaURBQTBEO0FBQzFELCtEQUFzQztBQUV0QyxNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUM7QUFDdkIsTUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDO0FBRXpCLElBQUksS0FBSyxHQUFHLElBQUksZUFBSyxFQUFFLENBQUM7QUFDeEIsSUFBSSxNQUFNLENBQUM7QUFDWCxJQUFJLEtBQUssR0FBRyxJQUFJLG9CQUFTLEVBQUUsQ0FBQztBQUU1QixJQUFJLGFBQUcsQ0FBQztJQUNOO1FBQ0UsSUFBSSxFQUFFLFVBQVU7UUFDaEIsTUFBTSxFQUFFLEtBQUs7UUFDYixFQUFFLEVBQUUsS0FBSyxFQUFDLEdBQUcsRUFBQyxFQUFFO1lBQ2QsSUFBSSxFQUFFLEtBQUssR0FBRyxHQUFHLEVBQUUsS0FBSyxHQUFHLENBQUMsRUFBRSxRQUFRLEVBQUUsSUFBSSxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQztZQUNoRSxJQUFJLEdBQUcsR0FBRyxNQUFNLEtBQUssQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQ3JELElBQUksUUFBUSxHQUFHO2dCQUNiLENBQUMsUUFBUSxJQUFJLFVBQVUsQ0FBQyxFQUFFLFFBQVE7Z0JBQ2xDLGFBQWEsRUFBRSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUU7YUFDakMsQ0FBQztZQUNGLElBQUksSUFBSSxHQUFHLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxhQUFhLEVBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ3pHLEdBQUcsQ0FBQyxJQUFJLEdBQUc7Z0JBQ1QsTUFBTSxFQUFFLENBQUM7Z0JBQ1QsS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNO2dCQUNsQixJQUFJO2FBQ0wsQ0FBQTtRQUNILENBQUM7S0FDRjtJQUNEO1FBQ0UsSUFBSSxFQUFFLFVBQVU7UUFDaEIsTUFBTSxFQUFFLFFBQVE7UUFDaEIsRUFBRSxFQUFFLEtBQUssRUFBQyxHQUFHLEVBQUMsRUFBRTtZQUNkLElBQUksRUFBRSxHQUFHLEVBQUUsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDO1lBQ3hCLElBQUksR0FBRyxHQUFHLE1BQU0sS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDckQsSUFBSSxJQUFJLEdBQUcsTUFBTSxHQUFHLENBQUMsU0FBUyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztZQUN4QyxHQUFHLENBQUMsSUFBSSxHQUFHO2dCQUNULE1BQU0sRUFBRSxDQUFDO2dCQUNULElBQUk7YUFDTCxDQUFBO1FBQ0gsQ0FBQztLQUNGO0NBQ0YsQ0FBQyxDQUFDLE1BQU0sQ0FBQywwQkFBVyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLFdBQUcsQ0FBQyxNQUFNLDBCQUFXLENBQUMsU0FBUyxDQUFDLElBQUksT0FBTyxDQUFDLENBQUM7QUFDL0MsQ0FBQyxDQUFDLENBQUM7QUFFSCxRQUFRO0FBQ1IsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ2IsV0FBVyxDQUFDLEdBQUcsRUFBRTtJQUNmLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNmLENBQUMsRUFBRSxJQUFJLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUUsZUFBZTtBQUVwQyxRQUFRO0FBQ1IsV0FBVyxDQUFDLEdBQUcsRUFBRTtJQUNmLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUNsQixDQUFDLEVBQUUsSUFBSSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFFLGtCQUFrQiJ9