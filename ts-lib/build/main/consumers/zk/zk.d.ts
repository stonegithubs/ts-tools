import AutoProxy from '../../lib/proxy/autoProxy/autoProxy';
export default class ZK {
    protected readonly txtCode: string;
    txtUserName?: string;
    txtPassword?: string;
    static baseURL: 'https://m.mycchk.com/tools/submit_ajax.ashx';
    sender: AutoProxy;
    constructor(txtCode: string, txtUserName?: string, txtPassword?: string);
    getData(params: any, uri?: any, method?: string, rqParams?: {
        json: boolean;
    }): Promise<any>;
    sendMSG(): Promise<any>;
    register(params: any): Promise<any>;
    login(taskId?: any): Promise<any>;
    task(id?: any): Promise<any>;
}
