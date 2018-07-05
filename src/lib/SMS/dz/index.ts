import Req from '../../../lib/request';
import { throwError, wait } from '../../utils';
import SMS from '../interfaces/SMS.base';

export default class DZ implements SMS {
  static readonly baseURL: string = 'http://api.jmyzm.com/http.do';
  requester: Req = new Req(DZ.baseURL, { json: false });
  protected token: string;
  constructor(protected uid: string, protected pwd: string, protected pid?: string) {}

  // 登陆 DZ, 获取 token
  async login(): Promise<any> {
    let { uid, pwd, requester } = this;
    let result = await requester.workFlow('', { action: 'loginIn', uid, pwd }) || '';
    return this.token = result.split('|')[1] || throwError(`登陆错误:\t${result}`);
  }

  // 获取用户信息, 包含 uid, scores(积分), coins(用户币), maxParallelCount(同时可获取号码数)
  async getUserInfos(): Promise<any> {
    await this._checkLogin();
    let { uid, token, requester } = this;
    let result = await requester.workFlow('', { action: 'getUserInfos', uid, token });
    let [, scores, coins, maxParallelCount] = result.split(';');
    return maxParallelCount !== undefined ? { uid, scores, coins, maxParallelCount } : throwError(`获取用户信息错误:\t${result}`);
  }

  async getMessageByMobile(mobile: string, reuse?: boolean, next_pid?: string): Promise<any>{
    let  { uid, token, requester } = this;
    let action = reuse ? 'getVcodeAndHoldMobilenum' : 'getVcodeAndReleaseMobile';
    let result = '';
    do {
      result = await requester.workFlow('', { action, uid, token, mobile, next_pid, author_uid: 'zhang179817004' }) || '';
    } while (result === 'not_receive' && await wait(2000, true));
    let [, message] = result.split('|');
    return { mobile, message };
  }

  // 获取短信验证码, 返回为 [{ mobile, message }] 类型
  async getMessage(size: number = 1, getMobileNumParams?: { pid: string, mobile?, size?, operator?, province?, notProvince?, vno?, city? }, reuse?: boolean, next_pid?: string): Promise<any>{
    await this._checkLogin();
    let  { uid, token, requester } = this;
    let result = await this.getMobileNums({ size, ...getMobileNumParams });
    return result ? Promise.all(result.map(mobile => this.getMessageByMobile(mobile, reuse, next_pid))) : throwError(`没有获取到手机号:\t${JSON.stringify(result)}`);
  }

  // 获取手机号, pid 为项目名, size 为获取条数
  async getMobileNums(params?: { pid?: string, size?: number, mobile?, operator?, province?, notProvince?, vno?, city? }): Promise<any>{
    await this._checkLogin();
    let { uid, token, requester } = this;
    let result = await requester.workFlow('', { action: 'getMobilenum', uid, token, size: 1, pid: this.pid, ...params });
    let data = result.split('|')[0];
    return  data ? data.split(';') : throwError(`获取手机号错误:\t${result}`);
  }

  // 请求以获取手机号列表
  async getRecvingInfo(params: { pid }): Promise<any>{
    await this._checkLogin();
    let { uid, token, requester } = this;
    let result = await requester.workFlow('', { action: 'getRecvingInfo', uid, token, ...params });
    return Array.isArray(result) ? result : throwError(`请求已获取号码列表失败:\t${result}`);
  }

  // 号码加黑
  async addIgnoreList(mobiles: (string | string[]), params?: { pid? }): Promise<any>{
    await this._checkLogin();
    mobiles = Array.isArray(mobiles) ? mobiles.join(',') : mobiles;
    let { uid, token, requester } = this;
    let result = await requester.workFlow('', { action: 'addIgnoreList', uid, token, pid: this.pid, ...params });
    return result
  }

  protected async _checkLogin(): Promise<any> {
    let { token } = this;
    if (!token) {
      await this.login();
    }
  }
}