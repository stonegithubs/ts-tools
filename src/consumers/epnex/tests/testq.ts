import Koa from '../../../lib/koa';
import Mongo from '../../../lib/mongo/';
import { getRandomInt, log } from '../../../lib/utils';
import Epnex from '../epnex';
import indexHtml from './index';

let YQM = {};

let mongo = new Mongo();

resume();

new Koa([
  {
    method: 'get',
    path: '/',
    cb: ctx => {
      ctx.body = indexHtml;
    }
  },
  {
    method: 'post',
    path: '/t',
    cb: async ctx => {
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
          ctx.body = '该邀请码已经使用! 如需继续操作, 请返回之前页面!'
        } else {
          if (interval === undefined || interval >= 1) {
            YQM[yqm] = true;
            let permission = await doTask(inviteCode, yqm, count, interval);
            ctx.body = permission.result ? `<span style="font-size: 30px;">添加成功!, 邀请码为:\t <span style="color:red;"> ${yqm} </span>\n如需继续操作, 请返回之前页面!</span>` : permission.message;
          } else {
            ctx.body = '注册频率必须大于等于 1 分钟, 如需继续操作, 请返回之前页面!';
          }
        }
      } else {
        ctx.body = '请输入邀请码! 如需继续操作, 请返回之前页面!'
      }
      return '';
    }
  }
]).listen(8889);

async function doTask(inviteCode, yqm, count = 20, interval):Promise<any> {
  let permission = await hasPermission(inviteCode);
  if (permission.result) {
    let ep = new Epnex(yqm);  // '00TPBBT'
    ep.task();
    if (--count > 0) {
      let randomTime = interval || getRandomInt(10, 2);
      log(`下一次将会在\t${randomTime}分钟后运行\t 剩余\t${count} 次`);
      setTimeout(() => {
        doTask(inviteCode, yqm, count, interval);
      }, randomTime * 1000 * 60);
    } else {
      YQM[yqm] = false;
      log('最后一次开始！', 'warn');
    }
    updateUserInfo(inviteCode, yqm, count, interval);
  } else {
    YQM[yqm] = false;
    log(permission.message, 'error');
  }
  return permission;
}


async function hasPermission(inviteCode): Promise<any> {
  let col = await mongo.getCollection('epnex', 'inviteCode');
  let inviteInfo = await col.findOne({ code: inviteCode });
  log(`邀请次数:\t${inviteInfo && inviteInfo.remain}`);
  if (inviteInfo && inviteInfo.remain > 0) {
    col.updateOne({code: inviteCode}, {$set: { remain: inviteInfo.remain - 1}});
    return  {
      result: true
    }
  }
  return {
    message: '没有邀请次数',
    result: false
  };
}

async function updateUserInfo(inviteCode, yqm, count, interval): Promise<any> {
  let col = await mongo.getCollection('epnex', 'runningUserInfo');
  if (count > 0) {
    let uinfo = await col.updateOne({ yqm, inviteCode, interval }, { $set: { count }}, { upsert: true });
    log('运行用户数据库更新成功, 更新用户:\t', uinfo);
  } else {
    let del = await col.deleteOne({inviteCode, yqm});
    log('用户次数减为零, 删除运行时用户成功!', del);
  }
}

async function resume(): Promise<any> {
  let col = await mongo.getCollection('epnex', 'runningUserInfo');
  let uInfos = await col.find().toArray();
  if (uInfos && uInfos.length) {
    uInfos.forEach(uinfo => {
      log('启动任务成功, 用户信息!', uinfo, 'warn');
      if (uinfo.count > 0) {
        YQM[uinfo.yqm] = true;
        doTask(uinfo.inviteCode, uinfo.yqm, uinfo.count, uinfo.interval);
      }
    });
  } else {
    log('没有正在运行的用户信息!', 'warn');
  }
}