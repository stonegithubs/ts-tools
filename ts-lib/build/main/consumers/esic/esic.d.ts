import AutoProxy from '../../lib/proxy/autoProxy/autoProxy';
export default class ESIC {
    inviteCode: any;
    static baseUrl: string;
    requester: AutoProxy;
    constructor(inviteCode: any);
    headers: {
        Host: string;
        Origin: string;
        Referer: string;
        'User-Agent': any;
        'X-Requested-With': string;
    };
    getData(url: any, data?: any, method?: string, params?: any): Promise<any>;
    getHTML(url?: string): Promise<any>;
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
    login(form: {
        mobile: any;
        password: any;
    }): Promise<void>;
    task(tskId: any): Promise<void>;
}
