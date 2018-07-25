export default class MyReq {
    protected readonly baseURL: string;
    protected conf: any;
    static getData(uri: string, body?: any, method?: string, params?: any): Promise<any>;
    static getJson(uri: string, body?: any, method?: string, params?: any): Promise<any>;
    readonly jar: object;
    data: any[];
    constructor(baseURL?: string, conf?: any);
    workFlow(uri: string, data?: object, method?: string, params?: any): Promise<any>;
    setProxy(proxy: string): void;
}
