import Requester from '../../lib/utils/declarations/requester';
import MyReq from '../../lib/request';
export default class INBEST implements Requester {
    referralCode: any;
    baseURL: string;
    requester: MyReq;
    headers: {
        Host: string;
        Referer: string;
        'User-Agent': any;
    };
    jar: any;
    constructor(referralCode: any);
    getData(url: any, data?: any, method?: string, params?: any): Promise<any>;
    getPvilidCode(): Promise<any>;
    getHTML(): Promise<any>;
    register(): Promise<void>;
}
