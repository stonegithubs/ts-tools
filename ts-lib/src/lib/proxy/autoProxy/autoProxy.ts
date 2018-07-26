import MyReq from "../../request";
import Requester from "../../utils/declarations/requester";
import ProxyPool from "../proxyPool/proxyPool";
import HttpsProxyAgent from 'https-proxy-agent'; // https 代理, 用于添加 connection 头
import { log } from "../../utils";

export default class AutoProxy implements Requester {
  static proxyList = [];
  static pool = new ProxyPool();
  requester = new MyReq();
  proxy: any;
  constructor() {}
  async send(url, data = {}, method = 'get', params = {}) {
    let { proxy, requester } = this;
    let { pool } = AutoProxy;
    if (!proxy) {
      let [ proxyUrl ] = await pool.getProxies(1, true);
      this.proxy = proxy = proxyUrl;
    }
    let { ip, port } = proxy;
    let agent = new HttpsProxyAgent({ host: ip, port });
    log('使用代理', proxy);
    return requester.workFlow(url, data, method, { agent, ...params });
  }
}