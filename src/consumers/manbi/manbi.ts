import Req from '../../lib/request';
import { md5 } from '../../lib/utils';

export default class Manbi{
  static baseUrl: string = 'http://api.coinbene.com';
  static version: string = 'v1';
  symbol: string = 'conieth'
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
    let rs = await this.getData('trade/balance', { account: 'exchange' });
    return rs;
  }
  async geTicker() {
    let rs = await this.getData('market/ticker', { symbol: this.symbol }, 'get');
    return rs;
  }
  async getOrderBook() {
    let rs = await this.getData('market/orderbook', { symbol: this.symbol}, 'get');
    return rs;
  }
  async buyAndSell(params: object) {
    let rs = await this.getData('trade/order/place', params);
    return rs;
  }
  getData(url, params?: any, method: string = 'post'): any {
    let { baseUrl, version } = Manbi;
    let { apiid } = this;
    let timestamp = Date.now();
    params = { apiid, timestamp, ...params };
    let sign = this.buildSign(params);
    let reqPamras = {} as any;
    if (method.toLowerCase() === 'post') {
      reqPamras.json = true;
    } else {
      reqPamras.form = true;
    }
    return Req.getJson(`${baseUrl}/${version}/${url}`, { ...params, sign }, method, reqPamras).then(data => {
      return typeof data === 'string' ? JSON.parse(data) : data;
    });
  }
}