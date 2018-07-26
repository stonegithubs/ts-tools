import MyReq from "../../request";
import Requester from "../../utils/declarations/requester";
import ProxyPool from "../proxyPool/proxyPool";
export default class AutoProxy implements Requester {
    static proxyList: any[];
    static pool: ProxyPool;
    requester: MyReq;
    proxy: any;
    constructor();
    send(url: any, data?: {}, method?: string, params?: any): Promise<any>;
}
