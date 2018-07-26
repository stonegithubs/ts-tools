import Requester from "../../utils/declarations/requester";
import MyReq from "../../request";
import { throwError, randomArray, check } from "../../utils";

export default class ProxyPool implements Requester{
  static instance;
  static domains = ['mlo.kim', 'chosan.cn', 'hk.static.kim'];
  static proxies = [];
  requester = new MyReq();
  isUpdating = false;
  constructor () {
    let { instance } = ProxyPool;
    return instance as ProxyPool || this;
  }

  /**
   * @param  {} count=1 获取代理数量
   * @param  {} origin=false 该字段为 true 时取得的是原始数据, 为 false 时获得拼接好的代理 url 字符串
   * @param  {} downward=true 如果代理余量小于获取量时, 该字段为 false, 则抛出 'lack of proxies' 异常
   */
  async getProxies(count = 1, origin = false, downward = true) {
    let { proxies } = ProxyPool;
    let ret = [];
    await check(() => !this.isUpdating);
    if (proxies.length < count) {
      await this.updateProxies();
    }
    while(count--) {
      let proxy = proxies.shift();
      if (proxy) {
        let { ip, protocol, port } = proxy;
        let data = origin ? proxy : `${protocol}://${ip}:${port}`;
        ret.push(data);
      } else {
        downward || throwError({ status: 0, message: 'lack of proxies' });
      }
    }
    return ret;
  }

  async updateProxies(params = {}) {
    let { requester } = this;
    let { domains } = ProxyPool;
    let domain = domains.shift();
    domains.push(domain);
    this.isUpdating = true;
    let result = await requester.workFlow(`http://${domain}:26670/proxies?u=lakdf%3Bllkjqw23134lk12j%3BL%3AKJFDLK%23%3ALEJE)(*_(_)%23&p=askdfkjllskfdj23lk4jl%3B12341lk2jl241234ljk12l`, {
      count: 10000,
      // u: 'lakdf%3Bllkjqw23134lk12j%3BL%3AKJFDLK%23%3ALEJE)(*_(_)%23',
      // p: 'askdfkjllskfdj23lk4jl%3B12341lk2jl241234ljk12l',
      ...params
    }, 'get', { json: true });
    if (result.status && result.data.length) {
      [].push.apply(ProxyPool.proxies, result.data);
    } else {
      throwError({
        status: 0,
        message: result.msg || 'no more proxies'
      });
    }
    this.isUpdating = false;
  }
}