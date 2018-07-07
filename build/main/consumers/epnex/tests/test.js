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
resume();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9jb25zdW1lcnMvZXBuZXgvdGVzdHMvdGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDJEQUFtQztBQUNuQyxnRUFBd0M7QUFDeEMsOENBQXVEO0FBQ3ZELHFEQUE2QjtBQUM3QixvREFBZ0M7QUFFaEMsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDO0FBRWIsSUFBSSxLQUFLLEdBQUcsSUFBSSxlQUFLLEVBQUUsQ0FBQztBQUV4QixNQUFNLEVBQUUsQ0FBQztBQUVULElBQUksYUFBRyxDQUFDO0lBQ047UUFDRSxNQUFNLEVBQUUsS0FBSztRQUNiLElBQUksRUFBRSxHQUFHO1FBQ1QsRUFBRSxFQUFFLEdBQUcsQ0FBQyxFQUFFO1lBQ1IsR0FBRyxDQUFDLElBQUksR0FBRyxlQUFTLENBQUM7UUFDdkIsQ0FBQztLQUNGO0lBQ0Q7UUFDRSxNQUFNLEVBQUUsTUFBTTtRQUNkLElBQUksRUFBRSxJQUFJO1FBQ1YsRUFBRSxFQUFFLEtBQUssRUFBQyxHQUFHLEVBQUMsRUFBRTtZQUNkLElBQUksRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztZQUM1RCxLQUFLLEdBQUcsUUFBUSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztZQUM1QixRQUFRLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUMxRCxJQUFJLEtBQUssSUFBSSxLQUFLLElBQUksS0FBSyxHQUFHLENBQUMsSUFBSSxLQUFLLEdBQUcsR0FBRyxFQUFFO2dCQUM5QyxPQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUcsdUJBQXVCLENBQUM7YUFDM0M7WUFDRCxJQUFJLFFBQVEsSUFB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