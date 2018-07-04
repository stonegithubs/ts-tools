import Req from '../../../lib/request';
import SMS from '../interfaces/SMS.base';
export default class DZ implements SMS {
    protected uid: string;
    protected pwd: string;
    protected pid?: string;
    static readonly baseURL: string;
    requester: Req;
    protected token: string;
    constructor(uid: string, pwd: string, pid?: string);
    login(): Promise<any>;
    getUserInfos(): Promise<any>;
    getMessageByMobile(mobile: string, reuse?: boolean, next_pid?: string): Promise<any>;
    getMessage(size?: number, getMobileNumParams?: {
        pid: string;
        mobile?: any;
        size?: any;
        operator?: any;
        province?: any;
        notProvince?: any;
        vno?: any;
        city?: any;
    }, reuse?: boolean, next_pid?: string): Promise<any>;
    getMobileNums(params?: {
        pid?: string;
        size?: number;
        mobile?: any;
        operator?: any;
        province?: any;
        notProvince?: any;
        vno?: any;
        city?: any;
    }): Promise<any>;
    getRecvingInfo(params: {
        pid: any;
    }): Promise<any>;
    addIgnoreList(mobiles: (string | string[]), params?: {
        pid?: any;
    }): Promise<any>;
    protected _checkLogin(): Promise<any>;
}
