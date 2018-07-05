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
    static getAgent(params) {
        let { host, port } = new url_1.URL(exports.dynamicForwardURL);
        return new https_proxy_agent_1.default(Object.assign({}, params, { host, port }));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbGliL3Byb3h5L3h1bmRhaWxpL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsMEVBQWdELENBQUMsOEJBQThCO0FBQy9FLDZCQUEwQjtBQUMxQix1Q0FBa0M7QUFFckIsUUFBQSxpQkFBaUIsR0FBRyw2QkFBNkIsQ0FBQztBQUUvRDtJQXFCRSxZQUErQixTQUFjLEVBQUU7UUFBaEIsV0FBTSxHQUFOLE1BQU0sQ0FBVTtJQUFHLENBQUM7SUFuQm5ELE1BQU0sQ0FBQyxVQUFVLENBQUMsVUFBZSxFQUFFLEVBQUUsTUFBMkI7UUFDOUQsT0FBTyxDQUFDLHFCQUFxQixDQUFDLEdBQUcsUUFBUSxDQUFDLHlCQUF5QixDQUFDLE1BQU0sQ0FBQyxDQUFDLHFCQUFxQixDQUFDO1FBQ2xHLE9BQU8sT0FBTyxDQUFDO0lBQ2pCLENBQUM7SUFDRCxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQWU7UUFDN0IsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsR0FBRyxJQUFJLFNBQUcsQ0FBQyx5QkFBaUIsQ0FBQyxDQUFDO1FBQ2hELE9BQU8sSUFBSSwyQkFBZSxtQkFBTSxNQUFNLElBQUUsSUFBSSxFQUFFLElBQUksSUFBRyxDQUFDO0lBQ3hELENBQUM7SUFDRCxNQUFNLENBQUMseUJBQXlCLENBQUMsTUFBTztRQUN0QyxJQUFJLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxTQUFTLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsR0FBRyxNQUFNLENBQUM7UUFDdEYsSUFBSSxRQUFRLEdBQUcsV0FBVyxPQUFPLFdBQVcsTUFBTSxjQUFjLFNBQVMsRUFBRSxDQUFDO1FBQzVFLElBQUksSUFBSSxHQUFHLFdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUN2QyxPQUFPO1lBQ0wsSUFBSTtZQUNKLFNBQVM7WUFDVCxxQkFBcUIsRUFBRSxRQUFRLElBQUksWUFBWSxPQUFPLGNBQWMsU0FBUyxFQUFFO1NBQ2hGLENBQUM7SUFDSixDQUFDO0lBSUQsY0FBYztRQUNaLEVBQUU7SUFDSixDQUFDO0lBRUQsVUFBVSxDQUFDLE9BQVk7UUFDckIsT0FBTyxRQUFRLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDbkQsQ0FBQztJQUVELHlCQUF5QjtRQUN2QixPQUFPLFFBQVEsQ0FBQyx5QkFBeUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBRUQsVUFBVSxDQUFDLFNBQWMsRUFBRTtRQUN6QixJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxHQUFHLElBQUksU0FBRyxDQUFDLHlCQUFpQixDQUFDLENBQUM7UUFDaEQsTUFBTSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQztRQUN0QyxNQUFNLENBQUMsa0JBQWtCLEdBQUcsS0FBSyxDQUFDO1FBQ2xDLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2hDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsSUFBSSwyQkFBZSxtQkFBTSxNQUFNLElBQUUsSUFBSSxFQUFFLElBQUksSUFBRyxDQUFDO1FBQzlELE9BQU8sTUFBTSxDQUFDO0lBQ2hCLENBQUM7Q0FDRjtBQTNDRCwyQkEyQ0MifQ==