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
            let { count = 100, begin = 0 } = ctx.query;
            let col = await mongo.getCollection(dbName, colName);
            let data = await col.find().limit(+count).skip(+begin).toArray();
            ctx.body = {
                status: 1,
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
setInterval(() => {
    proxy.task();
}, 1000 * 60 * 30); // 30 分钟更新一次数据库
// 检测新数据
setInterval(() => {
    proxy.checker();
}, 1000 * 60 * 20);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9jb25zdW1lcnMvcHJveHkvcHJveHlfcG9vbC90ZXN0cy90ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsOERBQXNDO0FBQ3RDLG1FQUEyQztBQUMzQyx5RkFBNEQ7QUFDNUQsaURBQTBEO0FBQzFELCtEQUFzQztBQUV0QyxNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUM7QUFDdkIsTUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDO0FBRXpCLElBQUksS0FBSyxHQUFHLElBQUksZUFBSyxFQUFFLENBQUM7QUFDeEIsSUFBSSxNQUFNLENBQUM7QUFDWCxJQUFJLEtBQUssR0FBRyxJQUFJLG9CQUFTLEVBQUUsQ0FBQztBQUU1QixJQUFJLGFBQUcsQ0FBQztJQUNOO1FBQ0UsSUFBSSxFQUFFLFVBQVU7UUFDaEIsTUFBTSxFQUFFLEtBQUs7UUFDYixFQUFFLEVBQUUsS0FBSyxFQUFDLEdBQUcsRUFBQyxFQUFFO1lBQ2QsSUFBSSxFQUFFLEtBQUssR0FBRyxHQUFHLEVBQUUsS0FBSyxHQUFHLENBQUMsRUFBRSxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUM7WUFDM0MsSUFBSSxHQUFHLEdBQUcsTUFBTSxLQUFLLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztZQUNyRCxJQUFJLElBQUksR0FBRyxNQUFNLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUNqRSxHQUFHLENBQUMsSUFBSSxHQUFHO2dCQUNULE1BQU0sRUFBRSxDQUFDO2dCQUNULElBQUk7YUFDTCxDQUFBO1FBQ0gsQ0FBQztLQUNGO0lBQ0Q7UUFDRSxJQUFJLEVBQUUsVUFBVTtRQUNoQixNQUFNLEVBQUUsUUFBUTtRQUNoQixFQUFFLEVBQUUsS0FBSyxFQUFDLEdBQUcsRUFBQyxFQUFFO1lBQ2QsSUFBSSxFQUFFLEdBQUcsRUFBRSxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUM7WUFDeEIsSUFBSSxHQUFHLEdBQUcsTUFBTSxLQUFLLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztZQUNyRCxJQUFJLElBQUksR0FBRyxNQUFNLEdBQUcsQ0FBQyxTQUFTLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBQ3hDLEdBQUcsQ0FBQyxJQUFJLEdBQUc7Z0JBQ1QsTUFBTSxFQUFFLENBQUM7Z0JBQ1QsSUFBSTthQUNMLENBQUE7UUFDSCxDQUFDO0tBQ0Y7Q0FDRixDQUFDLENBQUMsTUFBTSxDQUFDLDBCQUFXLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUU7SUFDekMsV0FBRyxDQUFDLE1BQU0sMEJBQVcsQ0FBQyxTQUFTLENBQUMsSUFBSSxPQUFPLENBQUMsQ0FBQztBQUMvQyxDQUFDLENBQUMsQ0FBQztBQUVILFFBQVE7QUFDUixXQUFXLENBQUMsR0FBRyxFQUFFO0lBQ2YsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ2YsQ0FBQyxFQUFFLElBQUksR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBRSxlQUFlO0FBRXBDLFFBQVE7QUFDUixXQUFXLENBQUMsR0FBRyxFQUFFO0lBQ2YsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQ2xCLENBQUMsRUFBRSxJQUFJLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDIn0=