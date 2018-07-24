import Redis from 'ioredis';
import rq from 'request';
import Chaojiying from '../../lib/chaojiying';
import { gMail } from '../../lib/mail/utils';
import Mongo from '../../lib/mongo/';
import XunDaili, { dynamicForwardURL } from '../../lib/proxy/xundaili';
import DZ from '../../lib/SMS/dz/';
import { getRandomInt, getRandomStr, log, throwError, wait, randomUA } from '../../lib/utils';
import Requester from '../../lib/utils/declarations/requester';
import MyReq from '../../lib/request';

//  --------- redis ---------

const redis = new Redis({ host: 'mlo.kim', password: '199381' });

redis.subscribe( 'mailReceived', (err, count) => err ? throwError(err.message) : log(`当前第 ${count} 位订阅 mailReceived 的用户`) );

//  --------- 超级鹰 ---------

const cjy = new Chaojiying('179817004', 'Mailofchaojiying*', '896776');

//  --------- DZ ---------

const dz = new DZ('zhang179817004', 'qq179817004*', '46021');

//  --------- XunDaili ---------

const xdl = new XunDaili({ orderno: 'ZF20187249103GcJiAA', secret: 'f7691def90804df3ba830c1a1308a718' }); // ZF2018744533NVHTc0 ZF20187249103GcJiAA

//  --------- MongoDB ---------

const mongo = new Mongo();

export default class LUCKYBI implements Requester {
  baseURL = 'http://www.luckybi.io';
  requester: MyReq = new MyReq('http://www.luckybi.io', { json: false });
  headers = {
    Host: 'www.luckybi.io',
    Referer: `http://www.luckybi.io/register?code=${this.inviteCode}`,
    user_timezone: 8,
    'User-Agent': randomUA()
  };
  jar = rq.jar();
  constructor(public inviteCode) {}

  async getData(url, data?, method = 'get', params?) {
    let { requester, headers } = this;
    let oParams = { headers, ...params };
    return requester.workFlow(url, data, method, xdl.wrapParams(
      oParams)
    );
  }

  async getHTML() {
    return this.getData(`/register?code=${this.inviteCode}`);
  }

  async getCaptchaId() {
    return this.getData('/auth/find/captchaId', {}, 'post');
  }

  async task() {
    await this.getHTML();
    return this.getCaptchaId();
  }
}
