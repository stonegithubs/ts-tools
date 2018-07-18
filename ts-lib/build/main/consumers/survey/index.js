"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_1 = __importDefault(require("../../lib/koa"));
const mongo_1 = __importDefault(require("../../lib/mongo/"));
const reverseProxyConf_1 = __importDefault(require("../../conf/reverseProxyConf"));
let mongo = new mongo_1.default();
new koa_1.default([
    {
        method: 'post',
        path: '/serveies',
        cb: async (ctx) => {
            let survey = ctx.request.body;
            let col = await mongo.getCollection('survey', 'survey');
            let result = await col.insertOne(survey);
            ctx.body = result.result;
        }
    }
]).listen(reverseProxyConf_1.default.survey.port);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29uc3VtZXJzL3N1cnZleS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLHdEQUFnQztBQUNoQyw2REFBcUM7QUFDckMsbUZBQXNEO0FBR3RELElBQUksS0FBSyxHQUFHLElBQUksZUFBSyxFQUFFLENBQUM7QUFFeEIsSUFBSSxhQUFHLENBQUM7SUFDTjtRQUNFLE1BQU0sRUFBRSxNQUFNO1FBQ2QsSUFBSSxFQUFFLFdBQVc7UUFDakIsRUFBRSxFQUFFLEtBQUssRUFBQyxHQUFHLEVBQUMsRUFBRTtZQUNkLElBQUksTUFBTSxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO1lBQzlCLElBQUksR0FBRyxHQUFHLE1BQU0sS0FBSyxDQUFDLGFBQWEsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUE7WUFDdkQsSUFBSSxNQUFNLEdBQUcsTUFBTSxHQUFHLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3pDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUMzQixDQUFDO0tBQ0Y7Q0FDRixDQUFDLENBQUMsTUFBTSxDQUFDLDBCQUFXLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDIn0=