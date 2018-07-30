import AutoProxy from '../../lib/proxy/autoProxy/autoProxy';
export default class ESIC {
    inviteCode: any;
    static baseUrl: string;
    requester: AutoProxy;
    constructor(inviteCode: any);
    ajaxHeader: {
        'X-Requested-With': string;
    };
    headers: {
        Host: string;
        Origin: string;
        Referer: string;
        'User-Agent': any;
    };
    getData(url: any, data?: any, method?: string, params?: any): Promise<any>;
    getHTML(url?: string, params?: any): Promise<any>;
    getCaptcha(): Promise<any>;
    validate(captchaData?: any): Promise<any>;
    getMobile(): Promise<any>;
    sendMsg(): Promise<"" | {
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
    redirect(): Promise<void>;
    task(tskId: any): Promise<void>;
}
