import rq from 'request';
import Mongo from '../../../lib/mongo';
import { getRandomInt, getRandomStr, log, throwError, wait, randomUA } from '../../../lib/utils';
import Requester from '../../../lib/utils/declarations/requester';
import MyReq from '../../../lib/request';
import childProcess from 'child_process';

//  --------- MongoDB ---------

const mongo = new Mongo();

export default class ProxyList{
  constructor(readonly conf = { cwd: '/zhangjianjun/proxy_pool' }) {}
  task() {
    let { conf } = this;
    childProcess.exec('python3 start.py;', conf, err => {
      err && log('执行proxy_pool出错', err, 'error');
    });
  }
}