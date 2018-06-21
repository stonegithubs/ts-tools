import Req from '../../lib/request';
import { md5 } from '../../lib/utils';

export default class Manbi{
  static baseUrl: string = 'http://api.coinbene.com';
  static version: string = 'v1';
  constructor(private apiid: string, private secret: string) {}
  buildSign(params: any): string {
    let { apiid, secret } = this;
    let timestamp = Date.now();
    let oParams = { timestamp, apiid, secret, ...params };
    let sign = '';
    for (let key of Object.keys(oParams).sort()) {
      sign += `${key}=${oParams[key]}&`
    }
    sign = sign.substring(0, sign.length - 1).toUpperCase();
    return md5(sign);
  }
  async getBalance(): Promise<any> {
    let rs = await this.getData('trade/balance', { account: 'exchange',  });
    return rs;
  }
  getData(url, params, method: string = 'post'): any {
    let { baseUrl, version } = Manbi;
    let { apiid } = this;
    let timestamp = Date.now();
    params = { apiid, timestamp, ...params };
    let sign = this.buildSign(params);
    let reqPamras = {} as any;
    reqPamras.json = method.toLowerCase() === 'post' ? true : undefined;
    console.log('ddd')
    return Req.getJson(`${baseUrl}/${version}/${url}`, { ...params, sign }, method, reqPamras);
  }
}