import { md5 } from "../../utils";

export const dynamicForwardURL = 'http://forward.xdaili.cn:80';

export default class XunDaili {
    static dynamicForwardURL: 'http://forward.xdaili.cn:80';

    static wrapHeader(header: any, params: { orderno, secret }) {
        return { ...header, 'Proxy-Authorization': XunDaili.getProxyAuthorizationSign(params).strProxyAuthorization };
    }
    static getProxyAuthorizationSign(params?): any {
        let { orderno, secret, timestamp = parseInt(String(Date.now() / 1000))} = params; 
        let planText = `orderno=${orderno},secret=${secret},timestamp=${timestamp}`;
        let sign = md5(planText).toUpperCase();
        return { 
            sign,
            timestamp,
            strProxyAuthorization: `sign=${sign}&orderno=${orderno}&timestamp=${timestamp}`
        }
    }

    constructor(protected readonly config: any = {}) {}

    dynamicForward() {}

    wrapHeader(headers: any) {
        return XunDaili.wrapHeader(headers, this.config);
    }

    getProxyAuthorizationSign() {
        return XunDaili.getProxyAuthorizationSign(this);
    }
}
