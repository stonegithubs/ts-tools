import MyReq from '../../lib/request';
import Requester from '../../lib/utils/declarations/requester';
export default class ZK implements Requester {
    protected readonly txtCode: string;
    txtUserName?: string;
    txtPassword?: string;
    static baseURL: 'https://m.mycchk.com/tools/submit_ajax.ashx';
    requester: MyReq;
    constructor(txtCode: string, txtUserName?: string, txtPassword?: string);
    getData(params: any, uri?: any, method?: string, rqParams?: {
        json: boolean;
    }): Promise<any>;
    sendMSG(): Promise<any>;
    register(params: any): Promise<any>;
    login(): Promise<any>;
    task(id?: any): Promise<any>;
}
