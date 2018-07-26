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
  // strict 为 true 时，如果发送错误则会抛出错误然后退出发送数据，为 false 时则会换个 proxy 继续尝试发送
  constructor(public strict = false) {}
  async send(url, data = {}, method = 'get', params: any = {}) {
    let { proxy, strict, requester } = this;
    let { pool } = AutoProxy;
    let timeout = params.timeout || 1000 * 60 * 4;
    do {
      if (!proxy) {
        let [ proxyUrl ] = await pool.getProxies(1, true);
        this.proxy = proxy = proxyUrl;
      }
      let { ip, port } = proxy;
      let agent = new HttpsProxyAgent({ host: ip, port });
      log('使用代理', proxy);
      let req = requester.workFlow(url, data, method, { rejectUnauthorized: false, agent, ...params });
      let result;
      try {
        if (timeout) {
          result = await Promise.race([req, wait(timeout, () => !result && Promise.reject('AutoProxy wait timeout超时'))]);
          return result;
        } else {
          return await req;
        }
      } catch (error) {
        proxy = null;
        result = true;  // 设置为 true 表示在 wait 之前接口已经有数据返回，本轮循环不需要再 reject
        log('AutoProxy发生错误，即将进行重试，错误信息:', error, 'error');
      }
    } while (!strict);
  }
  async update() {
    let { pool } = AutoProxy;
    this.requester = new MyReq();
    this.proxy = await pool.getProxies(1, true);
  }
}