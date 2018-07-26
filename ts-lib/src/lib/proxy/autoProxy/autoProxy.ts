import MyReq from "../../request";
import Requester from "../../utils/declarations/requester";
import ProxyPool from "../proxyPool/proxyPool";
import HttpsProxyAgent from 'https-proxy-agent'; // https 代理, 用于添加 connection 头
import { log, wait, throwError } from "../../utils";

export default class AutoProxy implements Requester {
  static proxyList = [];
  static pool = new ProxyPool();
  requester = new MyReq();
  proxy: any;
  constructor() {}
  async send(url, data = {}, method = 'get', params: any = {}) {
    let { proxy, requester } = this;
    let { pool } = AutoProxy;
    let timeout = params.timeout || 1000 * 60 * 4;
    if (!proxy) {
      let [ proxyUrl ] = await pool.getProxies(1, true);
      this.proxy = proxy = proxyUrl;
    }
    let { ip, port } = proxy;
    let agent = new HttpsProxyAgent({ host: ip, port });
    log('使用代理', proxy);
    let req = requester.workFlow(url, data, method, { rejectUnauthorized: false, agent, ...params });
    if (timeout) {
      return Promise.race([req, wait(timeout, throwError.bind(null, '发生错误'))]);
    } else {
      return req;
    }
  }
}