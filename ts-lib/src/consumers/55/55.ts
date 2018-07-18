import Requester from '../../lib/utils/declarations/requester';
import Mongo from '../../lib/mongo/';
import XunDaili from '../../lib/proxy/xundaili';
import MyReq from '../../lib/request';
import DZ from '../../lib/SMS/dz/';
import { buildURL, wait, log, getRandomStr, getRandomInt, throwError } from '../../lib/utils';

//  --------- DZ ---------

const dz = new DZ('zhang179817004', 'qq179817004*', '48351');

//  --------- XunDaili ---------

const xdl = new XunDaili({ orderno: 'ZF2018730302kdQRPU', secret: '944417ea359346e4ad882483cb63c13c' }); // ZF2018744533NVHTc0 ZF2018730302kdQRPU

//  --------- MongoDB ---------

const mongo = new Mongo();

export default class Coin55 implements Requester {
  requester = new MyReq('https://www.55.com', { json: true });
  constructor(protected inviteCode) {}
  getData(path, data, method = 'post', params = {} as any) {
    let newPath = buildURL(path, data);
    let { requester, inviteCode: code } = this;
    let headers = {
      token: params.token,
      'Content-Type': 'application/json;charset=UTF-8',
      Host: 'www.55.com',
      Origin: 'https://www.55.com',
      Pragma: 'no-cache',
      Referer: `https://www.55.com/login/sigin_up.html?code=${code}`,
      'X-Requested-With': 'XMLHttpRequest',
      'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1'
    };
    return requester.workFlow(newPath, data, method, xdl.wrapParams({ ...params, headers }));
  }
  async getHTML() {
    // 获取cookie
    let { requester, inviteCode: invite_code } = this;
    do {
      try {
        await requester.workFlow( `/invitation/signUpInvitation.html?invite_code=${invite_code}`, {}, 'get', { json: false } );
        return;
      } catch (error) {
        log('获取HTML出错！', error, 'error');
      }
    } while (await wait(2000, true));
  }
  async sendCode(phone) {
    let result;
    do {
      try {
        result = await this.getData('/api/sso/user/send', { codeType: 'PHONE', itc: '86', operateType: 'REGISTER', phone });
        if (result.expiredSeconds) return result;
        else if (result.code === 10001 && result.message === '该手机已被使用') {
          return false;
        }
      } catch (error) {
        log('发送手机验证码失败！', error, 'error');
      }
    } while (await wait(2000, true));
  }
  async getPhone() {
    let phone;
    do {
      try {
        phone = await dz.getMobileNums();
      } catch (error) {
        log('获取手机号错误!', error, 'error');
      }
    } while (!phone && (await wait(2000, true)));
    return phone;
  }
  async getCode(phone) {
    let result;
    do {
      try {
        result = await dz.getMessageByMobile(phone);
      } catch (error) {
        log('获取手机号错误!', error, 'error');
      }
    } while (!result && (await wait(2000, true)));
    log('dz验证信息：\t', result);
    return result.message.match(/您的验证码是：(\d+)，/)[1];
  }
  async checkCode(params) {
    let result;
    do {
      try {
        result = await this.getData('/api/sso/user/code_verify', { codeType: 'PHONE', operateType: 'REGISTER', ...params });
        if (result.token) return result;
      } catch (error) {
        log('发送手机验证码失败！', error, 'error');
      }
    } while (await wait(2000, true));
  }
  async register(params, token) {
    let result;
    let { inviteCode } = this;
    do {
      try {
        result = await this.getData( '/api/sso/user/register', { codeType: 'PHONE', inviteCode, itc: '86', ...params }, 'post', { token } );
        if (!result) return !result;
      } catch (error) {
        log('注册失败！', error, 'error');
      }
    } while (await wait(2000, true));
    return '';
  }
  async login(phone, password) {
    await this.getData('/login/sigin.html', {}, 'get', { json: false });
    let result = await this.getData('/api/sso/user/login', { codeType: 'PHONE', phone, password });
    console.log(result);
  }
  async task(task_id) {
    do {
      let { inviteCode } = this;
      await this.getHTML();
      let [phone] = await this.getPhone();
      let sendCodeResult = await this.sendCode(phone);
      if (!sendCodeResult) continue; // 手机号被使用
      let phoneCode;
      try {
        phoneCode = await this.getCode(phone);
      } catch (error) {
        log(error, 'error');
        continue;
      }
      let checkResult = await this.checkCode({ phoneCode, phone });
      log('验证成功！', new Date(checkResult.expiredTime).toLocaleString());
      let password = getRandomStr(14, 13) + getRandomInt(100000);
      let { token } = checkResult;
      let regResult = await this.register({ phone, password }, token);
      if (regResult) {
        let col = await mongo.getCollection('55', 'regists');
        col.insertOne({ phone, password, inviteCode, phoneCode, task_id }); console.log('注册完成！');
        this.login(phone, password);
        return log(`${task_id}注册成功!`, 'warn');
      }
      log('完成！', regResult);
    } while (await wait(2000, true));
  }
}
