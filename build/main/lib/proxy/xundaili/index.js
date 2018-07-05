"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const https_proxy_agent_1 = __importDefault(require("https-proxy-agent")); // https 代理, 用于添加 connection 头
const url_1 = require("url");
const utils_1 = require("../../utils");
exports.dynamicForwardURL = 'http://forward.xdaili.cn:80';
class XunDaili {
    constructor(config = {}) {
        this.config = config;
    }
    static wrapHeader(headers = {}, params) {
        headers['Proxy-Authorization'] = XunDaili.getProxyAuthorizationSign(params).strProxyAuthorization;
        return headers;
    }
    static getProxyAuthorizationSign(params) {
        let { orderno, secret, timestamp = parseInt(String(Date.now() / 1000), 10) } = params;
        let planText = `orderno=${orderno},secret=${secret},timestamp=${timestamp}`;
        let sign = utils_1.md5(planText).toUpperCase();
        return {
            sign,
            timestamp,
            strProxyAuthorization: `sign=${sign}&orderno=${orderno}&timestamp=${timestamp}`
        };
    }
    dynamicForward() {
        //
    }
    wrapHeader(headers) {
        return XunDaili.wrapHeader(headers, this.config);
    }
    getProxyAuthorizationSign() {
        return XunDaili.getProxyAuthorizationSign(this);
    }
    wrapParams(params = {}) {
        let { host, port } = new url_1.URL(exports.dynamicForwardURL);
        params.headers = params.headers || {};
        params.rejectUnauthorized = false;
        this.wrapHeader(params.headers);
        params.agent = new https_proxy_agent_1.default(Object.assign({}, params, { host, port }));
        return params;
    }
}
exports.default = XunDaili;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbGliL3Byb3h5L3h1bmRhaWxpL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsMEVBQWdELENBQUMsOEJBQThCO0FBQy9FLDZCQUEwQjtBQUMxQix1Q0FBa0M7QUFFckIsUUFBQSxpQkFBaUIsR0FBRyw2QkFBNkIsQ0FBQztBQUUvRDtJQWlCRSxZQUErQixTQUFjLEVBQUU7UUFBaEIsV0FBTSxHQUFOLE1BQU0sQ0FBVTtJQUFHLENBQUM7SUFmbkQsTUFBTSxDQUFDLFVBQVUsQ0FBQyxVQUFlLEVBQUUsRUFBRSxNQUEyQjtRQUM1RCxPQUFPLENBQUMscUJBQXFCLENBQUMsR0FBRyxRQUFRLENBQUMseUJBQXlCLENBQUMsTUFBTSxDQUFDLENBQUMscUJBQXFCLENBQUM7UUFDcEcsT0FBTyxPQUFPLENBQUM7SUFDakIsQ0FBQztJQUNELE1BQU0sQ0FBQyx5QkFBeUIsQ0FBQyxNQUFPO1FBQ3RDLElBQUksRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLFNBQVMsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRSxHQUFHLE1BQU0sQ0FBQztRQUN0RixJQUFJLFFBQVEsR0FBRyxXQUFXLE9BQU8sV0FBVyxNQUFNLGNBQWMsU0FBUyxFQUFFLENBQUM7UUFDNUUsSUFBSSxJQUFJLEdBQUcsV0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ3ZDLE9BQU87WUFDTCxJQUFJO1lBQ0osU0FBUztZQUNULHFCQUFxQixFQUFFLFFBQVEsSUFBSSxZQUFZLE9BQU8sY0FBYyxTQUFTLEVBQUU7U0FDaEYsQ0FBQztJQUNKLENBQUM7SUFJRCxjQUFjO1FBQ1osRUFBRTtJQUNKLENBQUM7SUFFRCxVQUFVLENBQUMsT0FBWTtRQUNyQixPQUFPLFFBQVEsQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNuRCxDQUFDO0lBRUQseUJBQXlCO1FBQ3ZCLE9BQU8sUUFBUSxDQUFDLHlCQUF5QixDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2xELENBQUM7SUFFRCxVQUFVLENBQUMsU0FBYyxFQUFFO1FBQ3pCLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEdBQUcsSUFBSSxTQUFHLENBQUMseUJBQWlCLENBQUMsQ0FBQztRQUNoRCxNQUFNLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDO1FBQ3RDLE1BQU0sQ0FBQyxrQkFBa0IsR0FBRyxLQUFLLENBQUM7UUFDbEMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDaEMsTUFBTSxDQUFDLEtBQUssR0FBRyxJQUFJLDJCQUFlLG1CQUFNLE1BQU0sSUFBRSxJQUFJLEVBQUUsSUFBSSxJQUFHLENBQUM7UUFDOUQsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQztDQUNGO0FBdkNELDJCQXVDQyJ9