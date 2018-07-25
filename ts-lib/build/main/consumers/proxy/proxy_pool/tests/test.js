"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_1 = __importDefault(require("../../../../lib/koa"));
const mongo_1 = __importDefault(require("../../../../lib/mongo/"));
const reverseProxyConf_1 = __importDefault(require("../../../../conf/reverseProxyConf"));
const utils_1 = require("../../../../lib/utils");
const dbName = 'proxy';
const colName = 'proxys';
let mongo = new mongo_1.default();
let cursor;
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
        path: '/delproxies',
        method: 'get',
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9jb25zdW1lcnMvcHJveHkvcHJveHlfcG9vbC90ZXN0cy90ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsOERBQXNDO0FBQ3RDLG1FQUEyQztBQUMzQyx5RkFBNEQ7QUFDNUQsaURBQTBEO0FBRTFELE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQztBQUN2QixNQUFNLE9BQU8sR0FBRyxRQUFRLENBQUM7QUFFekIsSUFBSSxLQUFLLEdBQUcsSUFBSSxlQUFLLEVBQUUsQ0FBQztBQUN4QixJQUFJLE1BQU0sQ0FBQztBQUdYLElBQUksYUFBRyxDQUFDO0lBQ047UUFDRSxJQUFJLEVBQUUsVUFBVTtRQUNoQixNQUFNLEVBQUUsS0FBSztRQUNiLEVBQUUsRUFBRSxLQUFLLEVBQUMsR0FBRyxFQUFDLEVBQUU7WUFDZCxJQUFJLEVBQUUsS0FBSyxHQUFHLEdBQUcsRUFBRSxLQUFLLEdBQUcsQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQztZQUMzQyxJQUFJLEdBQUcsR0FBRyxNQUFNLEtBQUssQ0FBQyxhQUFhLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQ3JELElBQUksSUFBSSxHQUFHLE1BQU0sR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ2pFLEdBQUcsQ0FBQyxJQUFJLEdBQUc7Z0JBQ1QsTUFBTSxFQUFFLENBQUM7Z0JBQ1QsSUFBSTthQUNMLENBQUE7UUFDSCxDQUFDO0tBQ0Y7SUFDRDtRQUNFLElBQUksRUFBRSxhQUFhO1FBQ25CLE1BQU0sRUFBRSxLQUFLO1FBQ2IsRUFBRSxFQUFFLEtBQUssRUFBQyxHQUFHLEVBQUMsRUFBRTtZQUNkLElBQUksRUFBRSxHQUFHLEVBQUUsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDO1lBQ3hCLElBQUksR0FBRyxHQUFHLE1BQU0sS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDckQsSUFBSSxJQUFJLEdBQUcsTUFBTSxHQUFHLENBQUMsU0FBUyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztZQUN4QyxHQUFHLENBQUMsSUFBSSxHQUFHO2dCQUNULE1BQU0sRUFBRSxDQUFDO2dCQUNULElBQUk7YUFDTCxDQUFBO1FBQ0gsQ0FBQztLQUNGO0NBQ0YsQ0FBQyxDQUFDLE1BQU0sQ0FBQywwQkFBVyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFO0lBQ3pDLFdBQUcsQ0FBQyxNQUFNLDBCQUFXLENBQUMsU0FBUyxDQUFDLElBQUksT0FBTyxDQUFDLENBQUM7QUFDL0MsQ0FBQyxDQUFDLENBQUMifQ==