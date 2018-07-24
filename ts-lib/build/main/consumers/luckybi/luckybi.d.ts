import Requester from '../../lib/utils/declarations/requester';
import MyReq from '../../lib/request';
export default class LUCKYBI implements Requester {
    inviteCode: any;
    baseURL: string;
    requester: MyReq;
    headers: {
        Host: string;
        Referer: string;
        user_timezone: number;
        'User-Agent': string;
    };
    jar: any;
    constructor(inviteCode: any);
    getData(url: any, data?: any, method?: string, params?: any): Promise<any>;
    getHTML(): Promise<any>;
    getCaptchaId(): Promise<any>;
    task(): Promise<any>;
}
