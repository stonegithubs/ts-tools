export declare const dynamicForwardURL = "http://forward.xdaili.cn:80";
export default class XunDaili {
    protected readonly config: any;
    static dynamicForwardURL: 'http://forward.xdaili.cn:80';
    static wrapHeader(header: any, params: {
        orderno: any;
        secret: any;
    }): any;
    static getProxyAuthorizationSign(params?: any): any;
    constructor(config?: any);
    dynamicForward(): void;
    wrapHeader(headers: any): any;
    getProxyAuthorizationSign(): any;
}
