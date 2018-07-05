"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_1 = __importDefault(require("../../../lib/koa"));
const mongo_1 = __importDefault(require("../../../lib/mongo/"));
const utils_1 = require("../../../lib/utils");
const epnex_1 = __importDefault(require("../epnex"));
const index_1 = __importDefault(require("./index"));
let YQM = {};
let mongo = new mongo_1.default();
new koa_1.default([
    {
        method: 'get',
        path: '/',
        cb: ctx => {
            //
            // ctx.body = fs.readFileSync('./index.html');
            ctx.body = index_1.default;
        }
    },
    {
        method: 'post',
        path: '/t',
        cb: async (ctx) => {
            let { yqm, count, inviteCode, interval } = ctx.request.body;
            if (~yqm.indexOf('http')) {
                yqm = yqm.match(/i=([0-9a-zA-Z]+)/)[1];
            }
            if (yqm) {
                //  || '00TPBBT'
                if (YQM[yqm]) {
                    ctx.body = '该邀请码已经使用! 如需继续操作, 请返回之前页面!';
                }
                else {
                    if (interval !== undefined || interval > 1) {
                        YQM[yqm] = true;
                        let permission = await doTask(ctx, yqm, count, interval);
                        ctx.body = permission.result ? '添加成功!, 如需继续操作, 请返回之前页面!' : permission.message;
                    }
                    else {
                        ctx.body = '注册频率必须大于等于 1 分钟, 如需继续操作, 请返回之前页面!';
                    }
                }
            }
            else {
                ctx.body = '请输入邀请码! 如需继续操作, 请返回之前页面!';
            }
        }
    }
]).listen(80);
async function doTask(ctx, yqm, count, interval) {
    let permission = await hasPermission(ctx);
    if (permission.result) {
        let ep = new epnex_1.default(yqm); // '00TPBBT'
        ep.task();
        if (--count > 0) {
            let randomTime = interval || utils_1.getRandomInt(10, 2);
            console.log(`下一次将会在\t${randomTime}分钟后运行\t 剩余\t${count} 次`);
            setTimeout(() => {
                doTask(ctx, yqm, count, interval);
            }, randomTime * 1000 * 60);
        }
    }
    return permission;
}
async function hasPermission(ctx) {
    let { inviteCode } = ctx.request.body;
    let col = await mongo.getCollection('epnex', 'inviteCode');
    let inviteInfo = await col.findOne({ code: inviteCode });
    if (inviteInfo && inviteInfo.remain > 0) {
        col.updateOne({ code: inviteCode }, { $set: { remain: inviteInfo.remain - 1 } });
        return {
            result: true
        };
    }
    return {
        message: '没有邀请次数',
        result: false
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9jb25zdW1lcnMvZXBuZXgvdGVzdHMvdGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUNBLDJEQUFtQztBQUNuQyxnRUFBd0M7QUFDeEMsOENBQWtEO0FBQ2xELHFEQUE2QjtBQUM3QixvREFBZ0M7QUFFaEMsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDO0FBRWIsSUFBSSxLQUFLLEdBQUcsSUFBSSxlQUFLLEVBQUUsQ0FBQztBQUV4QixJQUFJLGFBQUcsQ0FBQztJQUNOO1FBQ0UsTUFBTSxFQUFFLEtBQUs7UUFDYixJQUFJLEVBQUUsR0FBRztRQUNULEVBQUUsRUFBRSxHQUFHLENBQUMsRUFBRTtZQUNSLEVBQUU7WUFDRiw4Q0FBOEM7WUFDOUMsR0FBRyxDQUFDLElBQUksR0FBRyxlQUFTLENBQUM7UUFDdkIsQ0FBQztLQUNGO0lBQ0Q7UUFDRSxNQUFNLEVBQUUsTUFBTTtRQUNkLElBQUksRUFBRSxJQUFJO1FBQ1YsRUFBRSxFQUFFLEtBQUssRUFBQyxHQUFHLEVBQUMsRUFBRTtZQUNkLElBQUksRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztZQUM1RCxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRTtnQkFDeEIsR0FBRyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUN4QztZQUNELElBQUksR0FBRyxFQUFFO2dCQUNQLGdCQUFnQjtnQkFDaEIsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUU7b0JBQ1osR0FBRyxDQUFDLElBQUksR0FBRyw0QkFBNEIsQ0FBQTtpQkFDeEM7cUJBQU07b0JBQ0wsSUFBSSxRQUFRLEtBQUssU0FBUyxJQUFJLFFBQVEs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