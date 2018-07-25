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
    let chekcParallelCount = 1000; // 一次检测1000条
    let queue = [];
    while(await cursor.hasNext()) {
      queue.push(await cursor.next());
      if (queue.length >= chekcParallelCount || !await cursor.hasNext()) {
        let success = await this.doCheck(queue);
        log(`成功${success}条!`, 'warn');
        queue = [];
      }
    }
  }

  async doCheck(proxies = []) {
    let col = await mongo.getCollection('proxy', 'proxys');
    let cursor = await col.find();
    let count = 0;
    await Promise.all(proxies.map(async el => {
      let { protocol, ip, port } = el;
      try {
        let data = await MyReq.getJson('http://httpbin.org/ip', {}, 'get', { proxy: `${protocol}://${ip}:${port}` });
        if (data.origin) {
          // OK
          log('checker 成功', data);
          count++;
        } else {
          log('checker 失败', data, 'warn');
          col.deleteOne(el);
        }
      } catch (error) {
        log('checker 异常', error, 'error');
      }
    }));
    return count;
  }
}