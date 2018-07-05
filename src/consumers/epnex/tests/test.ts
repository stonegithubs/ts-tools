import fs from 'fs';
import Koa from '../../../lib/koa';
import Mongo from '../../../lib/mongo/';
import { getRandomInt } from '../../../lib/utils';
import Epnex from '../epnex';
import indexHtml from './index';

let YQM = {};

let mongo = new Mongo();

new Koa([
  {
    method: 'get',
    path: '/',
    cb: ctx => {
      //
      // ctx.body = fs.readFileSync('./index.html');
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
        yqm = yqm.match(/i=([0-9a-zA-Z]+)/)[1];
      }
      if (yqm) {
        //  || '00TPBBT'
        if (YQM[yqm]) {
          ctx.body = '该邀请码已经使用! 如需继续操作, 请返回之前页面!'
        } else {
          if (interval === undefined || interval >= 1) {
            YQM[yqm] = true;
            let permission = await doTask(ctx, yqm, count, interval);
            ctx.body = permission.result ? '添加成功!, 如需继续操作, 请返回之前页面!' : permission.message;
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

async function doTask(ctx, yqm, count = 20, interval):Promise<any> {
  let permission = await hasPermission(ctx);
  if (permission.result) {
    let ep = new Epnex(yqm);  // '00TPBBT'
    ep.task();
    if (--count > 0) {
      let randomTime = interval || getRandomInt(10, 2);
      console.log(`下一次将会在\t${randomTime}分钟后运行\t 剩余\t${count} 次`);
      setTimeout(() => {
        doTask(ctx, yqm, count, interval);
      }, randomTime * 1000 * 60);
    }
  } else {
    YQM[yqm] = false;
    console.error(permission.message);
  }
  return permission;
}


async function hasPermission(ctx): Promise<any> {
  let { inviteCode } = ctx.request.body;

  let col = await mongo.getCollection('epnex', 'inviteCode');
  let inviteInfo = await col.findOne({ code: inviteCode });
  console.log(`邀请次数:\t${inviteInfo && inviteInfo.remain}`);
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