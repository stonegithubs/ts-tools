"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_1 = __importDefault(require("../../lib/request"));
const utils_1 = require("../../lib/utils");
class Manbi {
    constructor(apiid, secret) {
        this.apiid = apiid;
        this.secret = secret;
        this.symbol = 'conieth';
    }
    buildSign(params) {
        let { apiid, secret } = this;
        let timestamp = Date.now();
        let oParams = Object.assign({ timestamp, apiid, secret }, params);
        let sign = '';
        for (let key of Object.keys(oParams).sort()) {
            sign += `${key}=${oParams[key]}&`;
        }
        sign = sign.substring(0, sign.length - 1).toUpperCase();
        return utils_1.md5(sign);
    }
    async getBalance() {
        let rs = await this.getData('trade/balance', { account: 'exchange' });
        return rs;
    }
    async geTicker() {
        let rs = await this.getData('market/ticker', { symbol: this.symbol }, 'get');
        return rs;
    }
    async getOrderBook() {
        let rs = await this.getData('market/orderbook', { symbol: this.symbol }, 'get');
        return rs;
    }
    async buyAndSell(params) {
        let rs = await this.getData('trade/order/place', params);
        return rs;
    }
    async getOrderInfo(params) {
        let rs = await this.getData('trade/order/info', params);
        return rs;
    }
    async getCurrentOrders(params) {
        let rs = await this.getData('trade/order/open-orders', params);
        return rs;
    }
    async cancelOrder(orderid) {
        let rs = await this.getData('trade/order/cancel', { orderid });
        return rs;
    }
    getData(url, params = {}, method = 'post') {
        let { baseUrl, version } = Manbi;
        let { apiid } = this;
        let timestamp = Date.now();
        let reqPamras = {};
        if (method.toLowerCase() === 'post') {
            params = Object.assign({ apiid, timestamp }, params);
            params.sign = this.buildSign(params);
            reqPamras.json = true;
        }
        else {
            reqPamras.form = true;
        }
        return request_1.default.getJson(`${baseUrl}/${version}/${url}`, params, method, reqPamras).then(data => {
            return typeof data === 'string' ? JSON.parse(data) : data;
        });
    }
}
Manbi.baseUrl = 'http://api.coinbene.com';
Manbi.version = 'v1';
exports.default = Manbi;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFuYmkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29uc3VtZXJzL21hbmJpL21hbmJpLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsZ0VBQW9DO0FBQ3BDLDJDQUFzQztBQUV0QztJQUlFLFlBQW9CLEtBQWEsRUFBVSxNQUFjO1FBQXJDLFVBQUssR0FBTCxLQUFLLENBQVE7UUFBVSxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBRHpELFdBQU0sR0FBVyxTQUFTLENBQUM7SUFDaUMsQ0FBQztJQUM3RCxTQUFTLENBQUMsTUFBVztRQUNuQixJQUFJLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQztRQUM3QixJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDM0IsSUFBSSxPQUFPLG1CQUFLLFNBQVMsRUFBRSxLQUFLLEVBQUUsTUFBTSxJQUFLLE1BQU0sQ0FBRSxDQUFDO1FBQ3RELElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUNkLEtBQUssSUFBSSxHQUFHLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUMzQyxJQUFJLElBQUksR0FBRyxHQUFHLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUE7U0FDbEM7UUFDRCxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUN4RCxPQUFPLFdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNuQixDQUFDO0lBQ0QsS0FBSyxDQUFDLFVBQVU7UUFDZCxJQUFJLEVBQUUsR0FBRyxNQUFNLElBQUksQ0FBQyxPQUFPLENBQUMsZUFBZSxFQUFFLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUM7UUFDdEUsT0FBTyxFQUFFLENBQUM7SUFDWixDQUFDO0lBQ0QsS0FBSyxDQUFDLFFBQVE7UUFDWixJQUFJLEVBQUUsR0FBRyxNQUFNLElBQUksQ0FBQyxPQUFPLENBQUMsZUFBZSxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUM3RSxPQUFPLEVBQUUsQ0FBQztJQUNaLENBQUM7SUFDRCxLQUFLLENBQUMsWUFBWTtRQUNoQixJQUFJLEVBQUUsR0FBRyxNQUFNLElBQUksQ0FBQyxPQUFPLENBQUMsa0JBQWtCLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQy9FLE9BQU8sRUFBRSxDQUFDO0lBQ1osQ0FBQztJQUNELEtBQUssQ0FBQyxVQUFVLENBQUMsTUFBYztRQUM3QixJQUFJLEVBQUUsR0FBRyxNQUFNLElBQUksQ0FBQyxPQUFPLENBQUMsbUJBQW1CLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDekQsT0FBTyxFQUFFLENBQUM7SUFDWixDQUFDO0lBQ0QsS0FBSyxDQUFDLFlBQVksQ0FBQyxNQUEyQjtRQUM1QyxJQUFJLEVBQUUsR0FBRyxNQUFNLElBQUksQ0FBQyxPQUFPLENBQUMsa0JBQWtCLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDeEQsT0FBTyxFQUFFLENBQUM7SUFDWixDQUFDO0lBQ0QsS0FBSyxDQUFDLGdCQUFnQixDQUFDLE1BQTBCO1FBQy9DLElBQUksRUFBRSxHQUFHLE1BQU0sSUFBSSxDQUFDLE9BQU8sQ0FBQyx5QkFBeUIsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUMvRCxPQUFPLEVBQUUsQ0FBQztJQUNaLENBQUM7SUFDRCxLQUFLLENBQUMsV0FBVyxDQUFDLE9BQU87UUFDdkIsSUFBSSxFQUFFLEdBQUcsTUFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLG9CQUFvQixFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQztRQUMvRCxPQUFPLEVBQUUsQ0FBQztJQUNaLENBQUM7SUFDRCxPQUFPLENBQUMsR0FBRyxFQUFFLFNBQWMsRUFBRSxFQUFFLFNBQWlCLE1BQU07UUFDcEQsSUFBSSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsR0FBRyxLQUFLLENBQUM7UUFDakMsSUFBSSxFQUFFLEtBQUssRUFBRSxHQUFHLElBQUksQ0FBQztRQUNyQixJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7UUFFM0IsSUFBSSxTQUFTLEdBQUcsRUFBUyxDQUFDO1FBQzFCLElBQUksTUFBTSxDQUFDLFdBQVcsRUFBRSxLQUFLLE1BQU0sRUFBRTtZQUNuQyxNQUFNLG1CQUFLLEtBQUssRUFBRSxTQUFTLElBQUssTUFBTSxDQUFFLENBQUM7WUFDekMsTUFBTSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3JDLFNBQVMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1NBQ3ZCO2FBQU07WUFDTCxTQUFTLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztTQUN2QjtRQUNELE9BQU8saUJBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxPQUFPLElBQUksT0FBTyxJQUFJLEdBQUcsRUFBRSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ3hGLE9BQU8sT0FBTyxJQUFJLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFDNUQsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDOztBQTNETSxhQUFPLEdBQVcseUJBQXlCLENBQUM7QUFDNUMsYUFBTyxHQUFXLElBQUksQ0FBQztBQUZoQyx3QkE2REMifQ==