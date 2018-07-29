import AutoProxy from '../../lib/proxy/autoProxy/autoProxy';
export default class ESIC {
    inviteCode: any;
    static baseUrl: string;
    requester: AutoProxy;
    constructor(inviteCode: any);
    getData(url: any, data?: any, method?: string, params?: any): Promise<any>;
    getHTML(): Promise<any>;
    getCaptcha(): Promise<any>;
    validate(captchaData?: any): Promise<any>;
    getMobile(): Promise<string>;
    sendMsg(form?: {
        mobile: any;
        geetest_challenge: any;
        geetest_validate: any;
        geetest_seccode: any;
    }): Promise<string>;
    register(form?: {
        mobile: any;
        sms_code: any;
        invite_code: any;
        password: any;
    }): Promise<void>;
    task(): Promise<void>;
}
