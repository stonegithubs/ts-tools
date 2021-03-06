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

const debug = false;

export default class ESIC {
  static baseUrl = 'http://esic.vip';
  requester = new AutoProxy({ baseUrl: 'http://esic.vip', conf: { json: true }}, debug);
  constructor(public inviteCode) {};
  ajaxHeader = {
    'X-Requested-With': 'XMLHttpRequest'
  }
  headers = {
    Host: 'esic.vip',
    Origin: 'http://esic.vip',
    Referer: 'http://esic.vip/index/publics/pwdregister.html',
    'User-Agent': randomUA()
  }
  async getData(url, data?, method = 'post', params: any = {}) {
    let { requester, headers } = this;

    params.headers = { ...headers, ...params.headers };
    return requester.send(url, data, method, //xdl.wrapParams(
      params
    );
  }

  async getHTML(url = '/index/publics/pwdregister.html', params: any = {}) {
    let headers = {
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      'Upgrade-Insecure-Requests': 1
    }
    params.headers = params.headers || {};
    params.headers = { ...headers, ...params.headers };
    return this.getData(url, {}, 'get', { json: false, ...params });
  }

  async getCaptcha() {
    let { ajaxHeader: headers } = this;
    return this.getData(`/index/publics/startcaptchaservlet.html?t=${Date.now()}`, {}, 'get', { headers } );
  }

  async validate(captchaData: any = {}) {
    captchaData.referer = ESIC.baseUrl;
    return gt.validate(captchaData);
  }

  async getMobile() {
    do {
      let [ mobile ] = await dz.getMobileNums();
      log(`获取手机号为：${mobile}`);
      if (await this.verifyPhone(mobile)) {
        log('手机号已经获取:\t', mobile);
        return mobile;
      } else {
        dz.addIgnoreList(mobile);
      }
    } while (await wait(2000, true));
  }

  async sendMsg() {
    let mobile;
    let { ajaxHeader: headers } = this;

    do {
      let captchaData = await this.getCaptcha();
      if (captchaData.gt && captchaData.challenge) {
        let validateResult = await this.validate(captchaData);
        if (validateResult.status === 'no') { continue; }
        let { challenge: geetest_challenge, validate: geetest_validate } = validateResult;
        let geetest_seccode = geetest_validate + '|jordan';
        mobile = mobile || await this.getMobile();
        let form = { mobile, geetest_challenge, geetest_validate , geetest_seccode } as any;
        try {
          let data = await this.getData('/index/code/getcode.html', form, 'post', { form, headers });
          let { code, msg } = data;
          if (code === 1 && msg === '验证码已发送') {
            let { message = '' } = await dz.getMessageByMobile(form.mobile);
            let code = message.match(/\d+/)[0];
            return code ? { code, mobile } : throwError('没有找到手机号');
          } else if (code === -1 && msg === '验证失败，请重新验证') {
            // 验证失败过后没发短信，手机号还可以用
            log('验证失败!! 即将重新验证!', 'warn');
            // return throwError('验证失败');
          } else {
            log('发送验证码失败, 错误:', data, 'warn');
            mobile = null;
          }
        } catch (error) {
          log('发送验证码出错!', error, 'error');
        }
      }
    } while (await wait(2000, true));
    return '';
  }

  async verifyPhone(mobile) {
    let { ajaxHeader: headers } = this;

    do {
      try {
        let result = await this.getData('/index/publics/verifymobile.html', { mobile }, 'get', { headers });
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
    let { ajaxHeader: headers } = this;
    do {
      let regResult = await this.getData('/index/publics/pwdregister.html', form, 'post', { form, headers });
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

  async login(form: { mobile, password }) {
    let { ajaxHeader: headers } = this;
    try {
      await this.getHTML('/index/publics/pwdlogin.html', { headers: {
        Referer: 'http://esic.vip/index/publics/pwdlogin.html'
      } });
      let loginData = await this.getData('/index/publics/pwdlogin.html', form, 'post', { form, headers });
      if (loginData.code === 1 && loginData.msg === '登录成功') {
        log('登录成功! 登陆信息为信息为：', loginData);
        this.redirect();
      }
    } catch (error) {
      log('登录错误！', error, 'error');
    }
  }

  async redirect() {
    do {
      try {
        let redirectResult = await this.getHTML('', {});
        if (redirectResult && ~redirectResult.indexOf('<title>ESIC企服链</title>')) {
          log('注册完成, 重定向完成!');
          break;
        }
      } catch (error) {
        log('重定向错误!', error, 'error');
      }
    } while (await wait(30000, true));
  }

  async task (tskId) {
    do {
      log(`${tskId}开始!`);
      let { inviteCode: invite_code } = this;
      let codeAndMobile;
      try {
        let html = await this.getHTML();
        codeAndMobile = await this.sendMsg();
      } catch (error) {
        log('接收验证码错误!', error, 'error');
        this.requester = new AutoProxy({ baseUrl: 'http://esic.vip', conf: { json: true }}, debug);
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
        this.requester = new AutoProxy({ baseUrl: 'http://esic.vip', conf: { json: true }}, debug);
        continue;
      }
      if (regResult) {
        let col = await mongo.getCollection('esic', 'regists');
        col.insertOne({ ...regParams, date: new Date().toLocaleString() });
        await this.redirect();
        return log(`${tskId}结束!`, 'warn');
      }
    } while (await wait(2000, true));
  }
}