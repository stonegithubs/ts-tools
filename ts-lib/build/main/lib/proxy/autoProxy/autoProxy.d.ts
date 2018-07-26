import MyReq from "../../request";
import Requester from "../../utils/declarations/requester";
import ProxyPool from "../proxyPool/proxyPool";
export default class AutoProxy implements Requester {
    strict: boolean;
    static proxyList: any[];
    static pool: ProxyPool;
    requester: MyReq;
    proxy: any;
    constructor(strict?: boolean);
    send(url: any, data?: {}, method?: string, params?: any): Promise<any>;
    update(): Promise<void>;
}
