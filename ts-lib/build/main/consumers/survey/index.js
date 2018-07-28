"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_1 = __importDefault(require("../../lib/koa"));
const mongo_1 = __importDefault(require("../../lib/mongo/"));
const reverseProxyConf_1 = __importDefault(require("../../conf/reverseProxyConf"));
const utils_1 = require("../../lib/utils");
let mongo = new mongo_1.default();
new koa_1.default([
    {
        method: 'get',
        path: '/queryCount',
        cb: async (ctx) => {
            utils_1.log('数据接收到!');
            let col = await mongo.getCollection('survey', 'survey');
            let result = await col.find().toArray();
            ctx.body = { status: 1, data: result.length };
            utils_1.log('数据写入完成!', result);
        }
    },
    {
        method: 'post',
        path: '/surveies',
        cb: async (ctx) => {
            let survey = ctx.request.body;
            utils_1.log('数据接收到!');
            let col = await mongo.getCollection('survey', 'survey');
            let result = await col.insertOne(survey);
            ctx.body = result.result;
            utils_1.log('数据写入完成!', result);
        }
    }
]).listen(reverseProxyConf_1.default.survey.port, function () {
    utils_1.log('e:\t', arguments);
    utils_1.log(`在端口${reverseProxyConf_1.default.survey.port}侦听成功!`);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29uc3VtZXJzL3N1cnZleS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLHdEQUFnQztBQUNoQyw2REFBcUM7QUFDckMsbUZBQXNEO0FBQ3RELDJDQUFzQztBQUV0QyxJQUFJLEtBQUssR0FBRyxJQUFJLGVBQUssRUFBRSxDQUFDO0FBRXhCLElBQUksYUFBRyxDQUFDO0lBQ047UUFDRSxNQUFNLEVBQUUsS0FBSztRQUNiLElBQUksRUFBRSxhQUFhO1FBQ25CLEVBQUUsRUFBRSxLQUFLLEVBQUMsR0FBRyxFQUFDLEVBQUU7WUFDZCxXQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDZCxJQUFJLEdBQUcsR0FBRyxNQUFNLEtBQUssQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFBO1lBQ3ZELElBQUksTUFBTSxHQUFHLE1BQU0sR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ3hDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDOUMsV0FBRyxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUN6QixDQUFDO0tBQ0Y7SUFDRDtRQUNFLE1BQU0sRUFBRSxNQUFNO1FBQ2QsSUFBSSxFQUFFLFdBQVc7UUFDakIsRUFBRSxFQUFFLEtBQUssRUFBQyxHQUFHLEVBQUMsRUFBRTtZQUNkLElBQUksTUFBTSxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO1lBQzlCLFdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNkLElBQUksR0FBRyxHQUFHLE1BQU0sS0FBSyxDQUFDLGFBQWEsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUE7WUFDdkQsSUFBSSxNQUFNLEdBQUcsTUFBTSxHQUFHLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3pDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztZQUN6QixXQUFHLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQ3pCLENBQUM7S0FDRjtDQUNGLENBQUMsQ0FBQyxNQUFNLENBQUMsMEJBQVcsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFO0lBQ2pDLFdBQUcsQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDdkIsV0FBRyxDQUFDLE1BQU0sMEJBQVcsQ0FBQyxNQUFNLENBQUMsSUFBSSxPQUFPLENBQUMsQ0FBQztBQUM1QyxDQUFDLENBQUMsQ0FBQyJ9