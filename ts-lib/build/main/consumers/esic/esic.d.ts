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
    getMobile(): Promise<any>;
    sendMsg(form?: {
        mobile: any;
    }): Promise<"" | {
        code: any;
        mobile: any;
    }>;
    verifyPhone(mobile: any): Promise<boolean>;
    register(form?: {
        mobile: any;
        sms_code: any;
        invite_code: any;
        password: any;
    }): Promise<boolean>;
    task(tskId: any): Promise<void>;
}
