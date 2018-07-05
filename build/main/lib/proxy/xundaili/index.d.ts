export declare const dynamicForwardURL = "http://forward.xdaili.cn:80";
export default class XunDaili {
    protected readonly config: any;
    static dynamicForwardURL: 'http://forward.xdaili.cn:80';
    static wrapHeader(headers: any, params: {
        orderno: any;
        secret: any;
    }): object;
    static getAgent(params?: object): object;
    static getProxyAuthorizationSign(params?: any): any;
    constructor(config?: any);
    dynamicForward(): void;
    wrapHeader(headers: any): object;
    getProxyAuthorizationSign(): object;
    wrapParams(params?: any): object;
}
