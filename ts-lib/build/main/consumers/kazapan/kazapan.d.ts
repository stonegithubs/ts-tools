import Requester from '../../lib/utils/declarations/requester';
import MyReq from '../../lib/request';
export default class KZP implements Requester {
    inviter: any;
    requester: MyReq;
    constructor(inviter: any);
    getData(url: any, data?: any, method?: string, params?: any): Promise<any>;
    getCaptcha(): Promise<any>;
    getEmailCode(): Promise<{}>;
    register(): Promise<any>;
    task(): Promise<void>;
}
