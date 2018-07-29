// 2018年7月8日23:37:17

import Mongo from '../../lib/mongo/';
import XunDaili from '../../lib/proxy/xundaili';
import MyReq from '../../lib/request';
import DZ from '../../lib/SMS/dz/';
import { getRandomInt, getRandomStr, log, throwError, wait, randomUA } from '../../lib/utils';
import Requester from '../../lib/utils/declarations/requester';
import AutoProxy from '../../lib/proxy/autoProxy/autoProxy';
import Geetest from '../../lib/captchaValidators/geetest/geetest';

//  --------- DZ ---------

const dz = new DZ('zhang179817004', 'qq179817004*', '48108');

//  --------- Geetest ---------

const gt = new Geetest('chosan', 'chosan179817004');

//  --------- XunDaili ---------

const xdl = new XunDaili({ orderno: 'ZF20187249103GcJiAA', secret: 'f7691def90804df3ba830c1a1308a718' }); // ZF2018744533NVHTc0 ZF20187249103GcJiAA

//  --------- MongoDB ---------

const mongo = new Mongo();


export default class ESIC {
  static baseUrl = 'http://esic.vip';
  requester = new AutoProxy({ baseUrl: 'http://esic.vip', conf: { json: true }}, true);
  constructor(public inviteCode){};

  async getData(url, data?, method = 'post', params: any = {}) {
    let headers = {
      Host: 'esic.vip',
      'User-Agent': randomUA()
    }
    params.headers = headers;
    let { requester } = this;
    return requester.send(url, data, method, //xdl.wrapParams(
      params
    )
    //);
  }

  async getHTML() {
    return this.getData('/index/publics/pwdregister.html', {}, 'get', { json: false });
  }

  async getCaptcha() {
    return this.getData(`/index/publics/startcaptchaservlet.html?t=${Date.now()}`);
  }

  async validate(captchaData: any = {}) {
    captchaData.referer = ESIC.baseUrl;
    return gt.validate(captchaData);
  }

  async getMobile() {
    return '17782369765';
  }

  async sendMsg(form?: { mobile, geetest_challenge, geetest_validate, geetest_seccode }) {
    let data = await this.getData('/index/code/getcode.html', form, 'post', { form, body: form });
    if (data.code === 1 && data.msg === '验证码已发送') {
      let sms_code = '';
      return sms_code;
    } else {
      return '';
    }
  }

  async register(form?: { mobile, sms_code, invite_code, password }) {
    this.getData('/index/publics/pwdregister.html', form, 'post', { form, body: form });
  }

  async task () {
    let html = await this.getHTML();
    let captchaData = await this.getCaptcha();
    let validateResult = await this.validate(captchaData);
    let { inviteCode: invite_code } = this;
    let mobile = await this.getMobile();
    let { challenge: geetest_challenge, validate: geetest_validate } = validateResult;
    let geetest_seccode = geetest_validate + '|jordan';
    let sms_code = await this.sendMsg({ mobile, geetest_challenge, geetest_validate , geetest_seccode });
    let password = 'Chosan179817004'// getRandomStr(15, 10);
    let regResult = await this.register({ mobile, sms_code, invite_code, password });
    log(regResult);
  }
}