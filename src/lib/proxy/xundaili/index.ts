import HttpsProxyAgent from 'https-proxy-agent'; // https 代理, 用于添加 connection 头
import { URL } from 'url';
import { md5 } from '../../utils';

export const dynamicForwardURL = 'http://forward.xdaili.cn:80';

export default class XunDaili {
  static dynamicForwardURL: 'http://forward.xdaili.cn:80';
  static wrapHeader(headers: any = {}, params: { orderno; secret }): object {
      headers['Proxy-Authorization'] = XunDaili.getProxyAuthorizationSign(params).strProxyAuthorization;
    return headers;
  }
  static getProxyAuthorizationSign(params?): any {
    let { orderno, secret, timestamp = parseInt(String(Date.now() / 1000), 10) } = params;
    let planText = `orderno=${orderno},secret=${secret},timestamp=${timestamp}`;
    let sign = md5(planText).toUpperCase();
    return {
      sign,
      timestamp,
      strProxyAuthorization: `sign=${sign}&orderno=${orderno}&timestamp=${timestamp}`
    };
  }

  constructor(protected readonly config: any = {}) {}

  dynamicForward(): void {
    //
  }

  wrapHeader(headers: any): object {
    return XunDaili.wrapHeader(headers, this.config);
  }

  getProxyAuthorizationSign(): object {
    return XunDaili.getProxyAuthorizationSign(this);
  }

  wrapParams(params: any = {}): object {
    let { host, port } = new URL(dynamicForwardURL);
    params.headers = params.headers || {};
    params.rejectUnauthorized = false;
    this.wrapHeader(params.headers);
    params.agent = new HttpsProxyAgent({ ...params, host, port });
    return params;
  }
}
