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
                        let permission = await doTask(inviteCode, yqm, count, interval);
                        ctx.body = permission.result ? `<span style="font-size: 30px;">添加成功!, 邀请码为:\t <span style="color:red;"> ${yqm} </span>\n如需继续操作, 请返回之前页面!</span>` : permission.message;
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
]).listen(8889);
async function doTask(inviteCode, yqm, count = 20, interval) {
    let permission = await hasPermission(inviteCode);
    if (permission.result) {
        let ep = new epnex_1.default(yqm); // '00TPBBT'
        ep.task();
        if (--count > 0) {
            let randomTime = interval || utils_1.getRandomInt(10, 2);
            utils_1.log(`下一次将会在\t${randomTime}分钟后运行\t 剩余\t${count} 次`);
            setTimeout(() => {
                doTask(inviteCode, yqm, count, interval);
            }, randomTime * 1000 * 60);
        }
        else {
            YQM[yqm] = false;
            utils_1.log('最后一次开始！', 'warn');
        }
        updateUserInfo(inviteCode, yqm, count, interval);
    }
    else {
        YQM[yqm] = false;
        utils_1.log(permission.message, 'error');
    }
    return permission;
}
async function hasPermission(inviteCode) {
    let col = await mongo.getCollection('epnex', 'inviteCode');
    let inviteInfo = await col.findOne({ code: inviteCode });
    utils_1.log(`邀请次数:\t${inviteInfo && inviteInfo.remain}`);
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
async function updateUserInfo(inviteCode, yqm, count, interval) {
    let col = await mongo.getCollection('epnex', 'runningUserInfo');
    if (count > 0) {
        let uinfo = await col.updateOne({ yqm, inviteCode, interval }, { $set: { count } }, { upsert: true });
        utils_1.log('运行用户数据库更新成功, 更新用户:\t', uinfo);
    }
    else {
        let del = await col.deleteOne({ inviteCode, yqm });
        utils_1.log('用户次数减为零, 删除运行时用户成功!', del);
    }
}
async function resume() {
    let col = await mongo.getCollection('epnex', 'runningUserInfo');
    let uInfos = await col.find().toArray();
    if (uInfos && uInfos.length) {
        uInfos.forEach(uinfo => {
            utils_1.log('启动任务成功, 用户信息!', uinfo, 'warn');
            if (uinfo.count > 0) {
                YQM[uinfo.yqm] = true;
                doTask(uinfo.inviteCode, uinfo.yqm, uinfo.count, uinfo.interval);
            }
        });
    }
    else {
        utils_1.log('没有正在运行的用户信息!', 'warn');
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9jb25zdW1lcnMvZXBuZXgvdGVzdHMvdGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDJEQUFtQztBQUNuQyxnRUFBd0M7QUFDeEMsOENBQXVEO0FBQ3ZELHFEQUE2QjtBQUM3QixvREFBZ0M7QUFFaEMsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDO0FBRWIsSUFBSSxLQUFLLEdBQUcsSUFBSSxlQUFLLEVBQUUsQ0FBQztBQUV4QixJQUFJLGFBQUcsQ0FBQztJQUNOO1FBQ0UsTUFBTSxFQUFFLEtBQUs7UUFDYixJQUFJLEVBQUUsR0FBRztRQUNULEVBQUUsRUFBRSxHQUFHLENBQUMsRUFBRTtZQUNSLEdBQUcsQ0FBQyxJQUFJLEdBQUcsZUFBUyxDQUFDO1FBQ3ZCLENBQUM7S0FDRjtJQUNEO1FBQ0UsTUFBTSxFQUFFLE1BQU07UUFDZCxJQUFJLEVBQUUsSUFBSTtRQUNWLEVBQUUsRUFBRSxLQUFLLEVBQUMsR0FBRyxFQUFDLEVBQUU7WUFDZCxJQUFJLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7WUFDNUQsS0FBSyxHQUFHLFFBQVEsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDNUIsUUFBUSxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDMUQsSUFBSSxLQUFLLElBQUksS0FBSyxJQUFJLEtBQUssR0FBRyxDQUFDLElBQUksS0FBSyxHQUFHLEdBQUcsRUFBRTtnQkFDOUMsT0FBTyxHQUFHLENBQUMsSUFBSSxHQUFHLHVCQUF1QixDQUFDO2FBQzNDO1lBQ0QsSUFBSSxRQUFRLElBQUksUUFBUSxJQUFJLENBQUMsUUFB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