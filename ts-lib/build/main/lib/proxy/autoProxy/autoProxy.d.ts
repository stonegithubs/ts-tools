import MyReq from "../../request";
import Requester from "../../utils/declarations/requester";
export default class autoProxy implements Requester {
    static cursor: number;
    static proxyList: any[];
    requester: MyReq;
}
