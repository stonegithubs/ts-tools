"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../utils");
exports.dynamicForwardURL = 'http://forward.xdaili.cn:80';
class XunDaili {
    constructor(config = {}) {
        this.config = config;
    }
    static wrapHeader(header, params) {
        return Object.assign({}, header, { 'Proxy-Authorization': XunDaili.getProxyAuthorizationSign(params).strProxyAuthorization });
    }
    static getProxyAuthorizationSign(params) {
        let { orderno, secret, timestamp = parseInt(String(Date.now() / 1000)) } = params;
        let planText = `orderno=${orderno},secret=${secret},timestamp=${timestamp}`;
        let sign = utils_1.md5(planText).toUpperCase();
        return {
            sign,
            timestamp,
            strProxyAuthorization: `sign=${sign}&orderno=${orderno}&timestamp=${timestamp}`
        };
    }
    dynamicForward() { }
    wrapHeader(headers) {
        return XunDaili.wrapHeader(headers, this.config);
    }
    getProxyAuthorizationSign() {
        return XunDaili.getProxyAuthorizationSign(this);
    }
}
exports.default = XunDaili;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbGliL3Byb3h5L3h1bmRhaWxpL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsdUNBQWtDO0FBRXJCLFFBQUEsaUJBQWlCLEdBQUcsNkJBQTZCLENBQUM7QUFFL0Q7SUFpQkksWUFBK0IsU0FBYyxFQUFFO1FBQWhCLFdBQU0sR0FBTixNQUFNLENBQVU7SUFBRyxDQUFDO0lBZG5ELE1BQU0sQ0FBQyxVQUFVLENBQUMsTUFBVyxFQUFFLE1BQTJCO1FBQ3RELHlCQUFZLE1BQU0sSUFBRSxxQkFBcUIsRUFBRSxRQUFRLENBQUMseUJBQXlCLENBQUMsTUFBTSxDQUFDLENBQUMscUJBQXFCLElBQUc7SUFDbEgsQ0FBQztJQUNELE1BQU0sQ0FBQyx5QkFBeUIsQ0FBQyxNQUFPO1FBQ3BDLElBQUksRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLFNBQVMsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQyxFQUFDLEdBQUcsTUFBTSxDQUFDO1FBQ2pGLElBQUksUUFBUSxHQUFHLFdBQVcsT0FBTyxXQUFXLE1BQU0sY0FBYyxTQUFTLEVBQUUsQ0FBQztRQUM1RSxJQUFJLElBQUksR0FBRyxXQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDdkMsT0FBTztZQUNILElBQUk7WUFDSixTQUFTO1lBQ1QscUJBQXFCLEVBQUUsUUFBUSxJQUFJLFlBQVksT0FBTyxjQUFjLFNBQVMsRUFBRTtTQUNsRixDQUFBO0lBQ0wsQ0FBQztJQUlELGNBQWMsS0FBSSxDQUFDO0lBRW5CLFVBQVUsQ0FBQyxPQUFZO1FBQ25CLE9BQU8sUUFBUSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3JELENBQUM7SUFFRCx5QkFBeUI7UUFDckIsT0FBTyxRQUFRLENBQUMseUJBQXlCLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDcEQsQ0FBQztDQUNKO0FBNUJELDJCQTRCQyJ9