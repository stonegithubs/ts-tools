export default class MyReq {
    static getJson(uri: string, body?: object, method?: string, params?: any): Promise<any>;
    readonly jar: object;
    data: any[];
    proxy: string;
    constructor();
    workFlow(uri: string, data?: object, method?: string, params?: any): Promise<any>;
    setProxy(proxy: string): void;
}
