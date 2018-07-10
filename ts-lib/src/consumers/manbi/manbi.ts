import Req from '../../lib/request';
import { md5 } from '../../lib/utils';

export default class Manbi{
  static baseUrl: string = 'http://api.coinbene.com';
  static version: string = 'v1';
  symbol: string = 'conieth';
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
  async geTicker(): Promise<any> {
    let rs = await this.getData('market/ticker', { symbol: this.symbol }, 'get');
    return rs;
  }
  async getOrderBook(): Promise<any> {
    let rs = await this.getData('market/orderbook', { symbol: this.symbol}, 'get');
    return rs;
  }
  async buyAndSell(params: object): Promise<any> {
    let rs = await this.getData('trade/order/place', params);
    return rs;
  }
  async getOrderInfo(orderid: string): Promise<any> {
    let rs = await this.getData('trade/order/info', { orderid });
    return rs;
  }
  async getCurrentOrders(params: { symbol: string }): Promise<any> {
    let rs = await this.getData('trade/order/open-orders', params);
    return rs;
  }
  async cancelOrder(orderid): Promise<any> {
    let rs = await this.getData('trade/order/cancel', { orderid });
    return rs;
  }
  getData(url, params: any = {}, method: string = 'post'): any {
    let { baseUrl, version } = Manbi;
    let { apiid } = this;
    let timestamp = Date.now();

    let reqPamras = {} as any;
    if (method.toLowerCase() === 'post') {
      params = { apiid, timestamp, ...params };
      params.sign = this.buildSign(params);
      reqPamras.json = true;
    } else {
      reqPamras.form = true;
    }
    return Req.getJson(`${baseUrl}/${version}/${url}`, params, method, reqPamras).then(data => {
      return typeof data === 'string' ? JSON.parse(data) : data;
    });
  }
}