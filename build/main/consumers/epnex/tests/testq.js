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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdHEuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvY29uc3VtZXJzL2VwbmV4L3Rlc3RzL3Rlc3RxLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsMkRBQW1DO0FBQ25DLGdFQUF3QztBQUN4Qyw4Q0FBdUQ7QUFDdkQscURBQTZCO0FBQzdCLG9EQUFnQztBQUVoQyxJQUFJLEdBQUcsR0FBRyxFQUFFLENBQUM7QUFFYixJQUFJLEtBQUssR0FBRyxJQUFJLGVBQUssRUFBRSxDQUFDO0FBRXhCLE1BQU0sRUFBRSxDQUFDO0FBRVQsSUFBSSxhQUFHLENBQUM7SUFDTjtRQUNFLE1BQU0sRUFBRSxLQUFLO1FBQ2IsSUFBSSxFQUFFLEdBQUc7UUFDVCxFQUFFLEVBQUUsR0FBRyxDQUFDLEVBQUU7WUFDUixHQUFHLENBQUMsSUFBSSxHQUFHLGVBQVMsQ0FBQztRQUN2QixDQUFDO0tBQ0Y7SUFDRDtRQUNFLE1BQU0sRUFBRSxNQUFNO1FBQ2QsSUFBSSxFQUFFLElBQUk7UUFDVixFQUFFLEVBQUUsS0FBSyxFQUFDLEdBQUcsRUFBQyxFQUFFO1lBQ2QsSUFBSSxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO1lBQzVELEtBQUssR0FBRyxRQUFRLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQzVCLFFBQVEsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQzFELElBQUksS0FBSyxJQUFJLEtBQUssSUFBSSxLQUFLLEdBQUcsQ0FBQyxJQUFJLEtBQUssR0FBRyxHQUFHLEVBQUU7Z0JBQzlDLE9BQU8sR0FBRyxDQUFDLElBQUksR0FBRyx1QkFBdUIsQ0FBQzthQUMzQztZQUNELElBQUksUUFBUSxJQUFJLFFBQVEsSUFBSSxDQUFDLFFBQVEsS0FBSyxTQUFTLElBQUksUUFBUSxHQUFHLENBQUMsQ0FBQyxFQUFFO2dCQUNwRSxPQUFPLEdBQUcsQ0FBQyxJQUFJLEdBQUcsa0JBQWtCLENBQUM7YUFDdEM7WUFDRCxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRTtnQkFDeEIsSUFBSSxLQUFLLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO2dCQUMxQyxHQUFHLEdBQUcsS0FBSyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUN6QjtZQUNELElBQUksR0FBRyxFQUFFO2dCQUNQLGdCQUFnQjtnQkFDaEIsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUU7b0JBQ1osR0FBRyxDQUFDLElBQUksR0FBRyw0QkFBNEIsQ0FBQTtpQkFDeEM7cUJBQU07b0JBQ0wsSUFBSSxRQUFRLEtBQUssU0FBUyxJQUFJLFFBQVEsSUFBSSxDQUFDLEVBQUU7d0JBQzNDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUM7d0JBQ2hCLElBQUksVUFBVSxHQUFHLE1BQU0sTUFBTSxDQUFDLFVBQVUsRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO3dCQUNoRSxHQUFHLENBQUMsSUFBSSxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLDJFQUEyRSxHQUFHLG1DQUFtQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDO3FCQUN2Szt5QkFBTTt3QkFDTCxHQUFHLENBQUMsSUFBSSxHQUFHLG1DQUFtQyxDQUFDO3FCQUNoRDtpQkFDRjthQUNGO2lCQUFNO2dCQUNMLEdBQUcsQ0FBQyxJQUFJLEdBQUcsMEJBQTBCLENBQUE7YUFDdEM7WUFDRCxPQUFPLEVBQUUsQ0FBQztRQUNaLENBQUM7S0FDRjtDQUNGLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7QUFFaEIsS0FBSyxpQkFBaUIsVUFBVSxFQUFFLEdBQUcsRUFBRSxLQUFLLEdBQUcsRUFBRSxFQUFFLFFBQVE7SUFDekQsSUFBSSxVQUFVLEdBQUcsTUFBTSxhQUFhLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDakQsSUFBSSxVQUFVLENBQUMsTUFBTSxFQUFFO1FBQ3JCLElBQUksRUFBRSxHQUFHLElBQUksZUFBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUUsWUFBWTtRQUN0QyxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDVixJQUFJLEVBQUUsS0FBSyxHQUFHLENBQUMsRUFBRTtZQUNmLElBQUksVUFBVSxHQUFHLFFBQVEsSUFBSSxvQkFBWSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNqRCxXQUFHLENBQUMsV0FBVyxVQUFVLGVBQWUsS0FBSyxJQUFJLENBQUMsQ0FBQztZQUNuRCxVQUFVLENBQUMsR0FBRyxFQUFFO2dCQUNkLE1BQU0sQ0FBQyxVQUFVLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztZQUMzQyxDQUFDLEVBQUUsVUFBVSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUMsQ0FBQztTQUM1QjthQUFNO1lBQ0wsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEtBQUssQ0FBQztZQUNqQixXQUFHLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1NBQ3hCO1FBQ0QsY0FBYyxDQUFDLFVBQVUsRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0tBQ2xEO1NBQU07UUFDTCxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDO1FBQ2pCLFdBQUcsQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0tBQ2xDO0lBQ0QsT0FBTyxVQUFVLENBQUM7QUFDcEIsQ0FBQztBQUdELEtBQUssd0JBQXdCLFVBQVU7SUFDckMsSUFBSSxHQUFHLEdBQUcsTUFBTSxLQUFLLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxZQUFZLENBQUMsQ0FBQztJQUMzRCxJQUFJLFVBQVUsR0FBRyxNQUFNLEdBQUcsQ0FBQyxPQUFPLENBQUMsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQztJQUN6RCxXQUFHLENBQUMsVUFBVSxVQUFVLElBQUksVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7SUFDakQsSUFBSSxVQUFVLElBQUksVUFBVSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7UUFDdkMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxFQUFDLElBQUksRUFBRSxVQUFVLEVBQUMsRUFBRSxFQUFDLElBQUksRUFBRSxFQUFFLE1BQU0sRUFBRSxVQUFVLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBQyxFQUFDLENBQUMsQ0FBQztRQUM1RSxPQUFRO1lBQ04sTUFBTSxFQUFFLElBQUk7U0FDYixDQUFBO0tBQ0Y7SUFDRCxPQUFPO1FBQ0wsT0FBTyxFQUFFLFFBQVE7UUFDakIsTUFBTSxFQUFFLEtBQUs7S0FDZCxDQUFDO0FBQ0osQ0FBQztBQUVELEtBQUsseUJBQXlCLFVBQVUsRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLFFBQVE7SUFDNUQsSUFBSSxHQUFHLEdBQUcsTUFBTSxLQUFLLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO0lBQ2hFLElBQUksS0FBSyxHQUFHLENBQUMsRUFBRTtRQUNiLElBQUksS0FBSyxHQUFHLE1BQU0sR0FBRyxDQUFDLFNBQVMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxLQUFLLEVBQUUsRUFBQyxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7UUFDckcsV0FBRyxDQUFDLHNCQUFzQixFQUFFLEtBQUssQ0FBQyxDQUFDO0tBQ3BDO1NBQU07UUFDTCxJQUFJLEdBQUcsR0FBRyxNQUFNLEdBQUcsQ0FBQyxTQUFTLENBQUMsRUFBQyxVQUFVLEVBQUUsR0FBRyxFQUFDLENBQUMsQ0FBQztRQUNqRCxXQUFHLENBQUMscUJBQXFCLEVBQUUsR0FBRyxDQUFDLENBQUM7S0FDakM7QUFDSCxDQUFDO0FBRUQsS0FBSztJQUNILElBQUksR0FBRyxHQUFHLE1BQU0sS0FBSyxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztJQUNoRSxJQUFJLE1BQU0sR0FBRyxNQUFNLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUN4QyxJQUFJLE1BQU0sSUFBSSxNQUFNLENBQUMsTUFBTSxFQUFFO1FBQzNCLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDckIsV0FBRyxDQUFDLGVBQWUsRUFBRSxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDcEMsSUFBSSxLQUFLLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRTtnQkFDbkIsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUM7Z0JBQ3RCLE1BQU0sQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7YUFDbEU7UUFDSCxDQUFDLENBQUMsQ0FBQztLQUNKO1NBQU07UUFDTCxXQUFHLENBQUMsY0FBYyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0tBQzdCO0FBQ0gsQ0FBQyJ9