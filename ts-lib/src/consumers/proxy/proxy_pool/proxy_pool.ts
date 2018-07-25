import rq from 'request';
import Mongo from '../../../lib/mongo';
import { getRandomInt, getRandomStr, log, throwError, wait, randomUA } from '../../../lib/utils';
import Requester from '../../../lib/utils/declarations/requester';
import MyReq from '../../../lib/request';
import childProcess from 'child_process';

//  --------- MongoDB ---------

const mongo = new Mongo();

export default class ProxyPoll{
  constructor(readonly conf = { cwd: '/zhangjianjun/proxy_pool' }) {}
  task() {
    let { conf } = this;
    childProcess.exec('python3 start.py;', conf, err => {
      err ? log('执行proxy_pool出错', err, 'error') : log('执行 proxy_pool 完成');
    });
  }
  async checker() {
    let col = await mongo.getCollection('proxy', 'proxys');
    let cursor = await col.find();
    cursor.forEach(async el => {
      let data = await MyReq.getJson('http://httpbin.org/ip');
      if (data.origin) {
        // OK
      } else {
        col.deleteOne(el);
      }
    })
  }
}