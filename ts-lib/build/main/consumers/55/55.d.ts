import Requester from '../../lib/utils/declarations/requester';
import MyReq from '../../lib/request';
export default class Coin55 implements Requester {
    protected inviteCode: any;
    requester: MyReq;
    constructor(inviteCode: any);
    getData(path: any, data: any, method?: string, params?: any): Promise<any>;
    getHTML(): Promise<void>;
    sendCode(phone: any): Promise<any>;
    getPhone(): Promise<any>;
    getCode(phone: any): Promise<any>;
    checkCode(params: any): Promise<any>;
    register(params: any, token: any): Promise<boolean>;
    login(phone: any, password: any): Promise<void>;
    task(): Promise<void>;
}
