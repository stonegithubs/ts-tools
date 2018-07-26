import Requester from "../../utils/declarations/requester";
import MyReq from "../../request";
export default class ProxyPool implements Requester {
    static instance: any;
    static domains: string[];
    static proxies: any[];
    requester: MyReq;
    isUpdating: boolean;
    constructor();
    /**
     * @param  {} count=1 获取代理数量
     * @param  {} origin=false 该字段为 true 时取得的是原始数据, 为 false 时获得拼接好的代理 url 字符串
     * @param  {} downward=true 如果代理余量小于获取量时, 该字段为 false, 则抛出 'lack of proxies' 异常
     */
    getProxies(count?: number, origin?: boolean, downward?: boolean): Promise<any[]>;
    updateProxies(params?: {}): Promise<void>;
}
