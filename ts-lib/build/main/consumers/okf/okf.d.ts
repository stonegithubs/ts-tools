import Requester from "../../lib/utils/declarations/requester";
import MyReq from "../../lib/request";
export default class OKF implements Requester {
    static baseURL: 'http://www.okf.com';
    static headers: {
        Host: 'www.okf.com';
        Pragma: 'no-cache';
        Referer: 'http://www.okf.com/index/publics/pwdregister.html';
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8';
    };
    requester: MyReq;
    getData(url: any, data?: any, method?: string, params?: any): Promise<any>;
    getCaptcha(): Promise<any>;
    sendMsg(form?: any): Promise<void>;
    task(captchaObj: any): Promise<void>;
}
