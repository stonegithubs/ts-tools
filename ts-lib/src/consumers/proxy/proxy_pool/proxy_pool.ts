import rq from 'request';
import Mongo from '../../../lib/mongo';
import { getRandomInt, getRandomStr, log, throwError, wait, randomUA } from '../../../lib/utils';
import Requester from '../../../lib/utils/declarations/requester';
import MyReq from '../../../lib/request';
import { spawn } from 'child_process';

//  --------- MongoDB ---------

const mongo = new Mongo();

export default class ProxyPoll{
  constructor(readonly conf = { cwd: '/zhangjianjun/proxy_pool' }) {}
  crawl() {
    let { conf } = this;
    log('开始执行爬取任务', 'warn');
    return new Promise((res, rej) => {
      const sp = spawn('python3', ['start.py;'], conf);
      let strOut = '';
      let strErr = '';
      sp.stdout.on('data', (data) => {
        strOut += data;
      });
      sp.stderr.on('data', (data) => {
        strErr += data;
      });
      sp.on('close', code => {
        log(`抓取进程退出, 退出代码:\t${code}`);
        res({ msg: code, output: strOut });
      })
      sp.on('error', err => {
        log('执行爬取数据出错!', err);
        rej({ msg: err, output: strErr });
      })
    })
  }
  async checker() {
    let col = await mongo.getCollection('proxy', 'proxys');
    let cursor = await col.find();
    let chekcParallelCount = 400; // 一次检测400条
    let count = 0;
    let queue = [];
    while(await cursor.hasNext()) {
      queue.push(await cursor.next());
      if (queue.length >= chekcParallelCount || !await cursor.hasNext()) {
        log(`从${count}条开始检测\t`, 'warn');
        let success = await this.doCheck(queue);
        count += queue.length;
        log(`检测成功, 参与检测\t${queue.length}\t条, 成功\t${success}\t条! 当前已检测\t${count}\t条`, 'warn');
        queue = [];
      }
    }
    log(`检测全部完成, 共 \t${count} \t条`, 'warn');
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
          col.updateOne(el, {$set: { lastCheckTime: new Date().toLocaleString() }});
          count++;
        } else {
          log('checker 失败', data, 'warn');
          col.deleteOne(el);
        }
      } catch (error) {
        log('checker 异常', error, 'error');
        col.deleteOne(el);
      }
    }));
    return count;
  }

  async task() {
    await this.crawl();
    return this.checker();
  }
}