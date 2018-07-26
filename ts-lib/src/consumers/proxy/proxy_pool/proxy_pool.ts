import rq from 'request';
import Mongo from '../../../lib/mongo';
import { getRandomInt, getRandomStr, log, throwError, wait, randomUA } from '../../../lib/utils';
import Requester from '../../../lib/utils/declarations/requester';
import MyReq from '../../../lib/request';
import { spawn } from 'child_process';
import HttpsProxyAgent from 'https-proxy-agent'; // https 代理, 用于添加 connection 头

//  --------- MongoDB ---------

const dbName = 'proxy';
const colName = 'proxys';
const mongo = new Mongo();

export default class ProxyPool{
  constructor(readonly conf = { cwd: '/zhangjianjun/proxy_pool' }) {}
  crawl() {
    let { conf } = this;
    log('开始执行爬取任务', 'warn');
    return new Promise((res, rej) => {
      const sp = spawn('python3', ['start.py'], conf);
      let strOut = '';
      let strErr = '';
      let taskId = setInterval(() => log('正在爬取', 'warn'), 6000);
      sp.stdout.on('data', data => {
        strOut += data;
        log(data + '');
      });
      sp.stderr.on('data', data => {
        strErr += data;
        log(data + '');
      });
      sp.on('close', code => {
        log(`抓取进程退出, 退出代码:\t${code}`, strOut);
        clearInterval(taskId);
        res({ msg: code, output: strOut });
      })
      sp.on('error', err => {
        log('执行爬取数据出错!', err, strErr);
        clearInterval(taskId);
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
    let round = 0;
    while(await cursor.hasNext()) {
      queue.push(await cursor.next());
      if (queue.length >= chekcParallelCount || !await cursor.hasNext()) {
        log(`从${count}条开始检测\t`, 'warn');
        let success = await this.doCheck(queue, ++round);
        count += queue.length;
        log(`检测成功, 参与检测\t${queue.length}\t条, 成功\t${success}\t条! 当前已检测\t${count}\t条`, 'warn');
        queue = [];
      }
    }
    log(`检测全部完成, 共 \t${count} \t条`, 'warn');
  }

  async doCheck(proxies = [], round) {
    let col = await mongo.getCollection('proxy', 'proxys');
    let success = 0;
    let count = 0;
    await Promise.all(proxies.map(async (el, index) => {
      let { protocol, ip, port } = el;
      let data;
      let timeout = 1000 * 60 * 4;  // 超时设置为4分钟
      log(`队列中第${index + 1}条开始进行检测!`, 'warn');
      let id = setInterval(() => log(`正在检测第${index+1}条`, el, 'warn'), 10000);
      try {
        let params = {
          headers: {
            'User-Agent': randomUA()
          },
          timeout
        }
        if (protocol.toLowerCase() === 'https') {
          let agent = new HttpsProxyAgent({ host: ip, port });
          data = MyReq.getJson('http://httpbin.org/ip', {}, 'get', { rejectUnauthorized: false, agent, ...params });
        } else {
          data = MyReq.getJson('http://httpbin.org/ip', {}, 'get', { proxy: `${protocol}://${ip}:${port}`, ...params });
        }
        data = await Promise.race([data, wait(timeout, {})]);   // timeout 可能被操作系统的 TCP timeout 覆盖， 此处设置最高4分钟，超过则认为超时
        if (data.origin) {
          // OK
          log('checker 成功', data);
          col.updateOne(el, {$set: { lastCheckTime: new Date().toLocaleString() }});
          success++;
        } else {
          log('checker 失败', data, 'warn');
          col.deleteOne(el);
        }
      } catch (error) {
        log('checker 异常', error, 'error');
        col.deleteOne(el);
      }
      clearInterval(id);
      log(`第${round}队列中第${index + 1}条检测完成，已完成${++count}条，共${proxies.length}条，成功${success}条`, 'warn');
    }));
    return success;
  }

  async stripDuplicates(cursor?): Promise<any> {
    let proxyPool = {};
    let duplicates = 0;
    let col = await mongo.getCollection(dbName, colName);
    if (!cursor) {
      cursor = await col.find({ lastCheckTime: { $exists: true }});
    }
    return new Promise((res, rej) => {
      cursor.forEach(el => {  // 去重处理, 使用 cursor 可以节省内存
        let { protocol, ip, port } = el;
        let key = `${protocol}://${ip}:${port}`;
        if (proxyPool[key]) {
          duplicates++;
          col.deleteOne(el);
        } else {
          proxyPool[key] = el;
        }
      }, err => {
        if (err) {
          rej({ status: 0, count: 0, duplicates, data: err });
        } else {
          let data = Object.values(proxyPool);
          res({ status: 1, count: data.length, duplicates, data });
        }
      })
    })
  }

  async task() {
    await this.crawl();
    await this.checker();
    let { duplicates } = await this.stripDuplicates();
    log(`task 完成, 清理重复数据${duplicates}条`, 'warn');
  }
}