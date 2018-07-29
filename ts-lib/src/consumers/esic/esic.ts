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

const dz = new DZ('zhang179817004', 'qq179817004*', '44887');

//  --------- Geetest ---------

const gt = new Geetest('chosan', 'chosan179817004');

//  --------- XunDaili ---------

const xdl = new XunDaili({ orderno: 'ZF20187249103GcJiAA', secret: 'f7691def90804df3ba830c1a1308a718' }); // ZF2018744533NVHTc0 ZF20187249103GcJiAA

//  --------- MongoDB ---------

const mongo = new Mongo();


export default class ESIC {
  static baseUrl = 'http://esic.vip';
  requester = new AutoProxy({ baseUrl: 'http://esic.vip', conf: { json: true }});
  constructor(public inviteCode){};

  async getData(url, data?, method = 'post', params: any = {}) {
    let headers = {
      Host: 'esic.vip',
      Origin: 'http://esic.vip',
      Referer: 'http://esic.vip/index/publics/pwdregister.html',
      'User-Agent': randomUA(),
      'X-Requested-With': 'XMLHttpRequest'
    }
    params.headers = { ...headers, ...params.headers };
    let { requester } = this;
    return requester.send(url, data, method, params);
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
    do {
      let [ mobile ] = await dz.getMobileNums();
      if (await this.verifyPhone(mobile)) {
        log('手机号已经获取:\t', mobile);
        return mobile;
      } else {
        dz.addIgnoreList(mobile);
      }
    } while (await wait(2000, true));
  }

  async sendMsg(form?: { mobile }) {
    let mobile;
    do {
      let tskId;
      let captchaData = await this.getCaptcha();
      if (captchaData.gt && captchaData.challenge) {
        let validateResult = await this.validate(captchaData);
        if (validateResult.status === 'no') { continue; }
        let { challenge: geetest_challenge, validate: geetest_validate } = validateResult;
        let geetest_seccode = geetest_validate + '|jordan';
        mobile = mobile || await this.getMobile();
        form = { mobile, geetest_challenge, geetest_validate , geetest_seccode } as any;
        try {
          let data = await this.getData('/index/code/getcode.html', form, 'post', { form });
          // 1 分钟发一次验证码
          tskId = setInterval(async () => data = await this.getData('/index/code/getcode.html', form, 'post', { form }).catch(e => log(e, 'error')), 1000 * 70);
          let { code, msg } = data;
          if (code === 1 && msg === '验证码已发送') {
            let { message = '' } = await dz.getMessageByMobile(form.mobile);
            let code = message.match(/\d+/)[0];
            return code ? { code, mobile } : throwError('没有找到手机号');
          } else if (code === -1 && msg === '验证失败，请重新验证') {
            return throwError('验证失败');
          }
        } catch (error) {
          log('发送验证码出错!', error, 'error');
        } finally {
          clearInterval(tskId);
        }
      }
    } while (await wait(2000, true));
    return '';
  }

  async verifyPhone(mobile) {
    do {
      try {
        let result = await this.getData('/index/publics/verifymobile.html', { mobile }, 'get');
        let { code, msg } = result;
        if (code === 1 && msg === '该手机号已注册请登录') {
          return false;
        } else if (code === -1 && msg === '该手机号可以注册') {
          return true;
        }
      } catch (error) {
        log('验证手机号出错!', error, 'error');
      }
    } while (await wait(2000, true));
    return false;
  }

  async register(form?: { mobile, sms_code, invite_code, password }) {
    do {
      let regResult = await this.getData('/index/publics/pwdregister.html', form, 'post', { form });
      let { code, msg } = regResult;
      if (code === 1) {
        return true;
      } else if (code === -1 && msg === '短信验证码错误') {
        return throwError(regResult);
      } else if (msg === '邀请人已被禁用') {
        let col = await mongo.getCollection('esic', 'running');
        col.updateOne({ code: form.invite_code }, { $inc: { count: 100000 }}, { upsert: true });
        return throwError(regResult);
      }
    } while (await wait(30000, true)); // 30 秒钟执行一次, 频率太快会被识别
    return false;
  }

  async task (tskId) {
    do {
      log(`${tskId}开始!`);
      let { inviteCode: invite_code } = this;
      let codeAndMobile;
      try {
        await this.getHTML();
        codeAndMobile = await this.sendMsg();
      } catch (error) {
        log('接收验证码错误!', error, 'error');
        this.requester = new AutoProxy({ baseUrl: 'http://esic.vip', conf: { json: true }});
        continue;
      }
      let password = getRandomStr(15, 12);
      let { code: sms_code, mobile } = codeAndMobile;
      let regParams = { mobile, sms_code, invite_code, password };
      let regResult;
      try {
        regResult = await this.register(regParams);
      } catch (error) {
        log('注册错误', error, 'error');
        this.requester = new AutoProxy({ baseUrl: 'http://esic.vip', conf: { json: true }});
        continue;
      }
      if (regResult) {
        let col = await mongo.getCollection('esic', 'regists');
        col.insertOne(regParams);
        log(`${tskId}结束!`, 'warn');
        return;
      }
    } while (await wait(2000, true));
  }
}