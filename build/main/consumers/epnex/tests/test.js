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
            count = parseInt(count, 10);
            interval = !interval ? undefined : parseInt(interval, 10);
            if (count != count || count < 1 || count > 200) {
                return ctx.body = '邀请次数必须大于 1 小于 200 的整数';
            }
            if (interval != interval || (interval !== undefined && interval < 1)) {
                return ctx.body = '注册频率必须大于等于 1 的整数';
            }
            if (~yqm.indexOf('http')) {
                let match = yqm.match(/i=([0-9a-zA-Z]+)/);
                yqm = match && match[1];
            }
            if (yqm) {
                //  || '00TPBBT'
                if (YQM[yqm]) {
                    ctx.body = '该邀请码已经使用! 如需继续操作, 请返回之前页面!';
                }
                else {
                    if (interval === undefined || interval >= 1) {
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
            return '';
        }
    }
]).listen(80);
async function doTask(ctx, yqm, count = 20, interval) {
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
    else {
        YQM[yqm] = false;
        console.error(permission.message);
    }
    return permission;
}
async function hasPermission(ctx) {
    let { inviteCode } = ctx.request.body;
    let col = await mongo.getCollection('epnex', 'inviteCode');
    let inviteInfo = await col.findOne({ code: inviteCode });
    console.log(`邀请次数:\t${inviteInfo && inviteInfo.remain}`);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9jb25zdW1lcnMvZXBuZXgvdGVzdHMvdGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUNBLDJEQUFtQztBQUNuQyxnRUFBd0M7QUFDeEMsOENBQWtEO0FBQ2xELHFEQUE2QjtBQUM3QixvREFBZ0M7QUFFaEMsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDO0FBRWIsSUFBSSxLQUFLLEdBQUcsSUFBSSxlQUFLLEVBQUUsQ0FBQztBQUV4QixJQUFJLGFBQUcsQ0FBQztJQUNOO1FBQ0UsTUFBTSxFQUFFLEtBQUs7UUFDYixJQUFJLEVBQUUsR0FBRztRQUNULEVBQUUsRUFBRSxHQUFHLENBQUMsRUFBRTtZQUNSLEVBQUU7WUFDRiw4Q0FBOEM7WUFDOUMsR0FBRyxDQUFDLElBQUksR0FBRyxlQUFTLENBQUM7UUFDdkIsQ0FBQztLQUNGO0lBQ0Q7UUFDRSxNQUFNLEVBQUUsTUFBTTtRQUNkLElBQUksRUFBRSxJQUFJO1FBQ1YsRUFBRSxFQUFFLEtBQUssRUFBQyxHQUFHLEVBQUMsRUFBRTtZQUNkLElBQUksRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztZQUM1RCxLQUFLLEdBQUcsUUFBUSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztZQUM1QixRQUFRLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUMxRCxJQUFJLEtBQUssSUFBSSxLQUFLLElBQUksS0FBSyxHQUFHLENBQUMsSUFBSSxLQUFLLEdBQUcsR0FBRyxFQUFFO2dCQUM5QyxPQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUcsdUJBQXVCLENBQUM7YUFDM0M7WUFDRCxJQUFJLFFBQVEs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