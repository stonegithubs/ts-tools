"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const okex_1 = __importDefault(require("./okex"));
// import moment from 'moment';
const utils_1 = require("../../lib/utils");
class OkexStratege extends okex_1.default {
    constructor(apiKey, secretKey) {
        super(apiKey, secretKey);
        this.kLine = {};
    }
    task(coinFrom, coinTo, Y) {
        let kLineName = coinFrom + coinTo + Y;
        let kLine = this.kLine[kLineName] = [];
        this.wsSubKLine(coinFrom, coinTo, Y, data => {
            data.forEach(el => {
                el.data.forEach(el => {
                    let [timestamp, openPrice, highPrice, , closePrice] = el;
                    let diff = closePrice - openPrice;
                    // let time = moment(Number(timestamp)).format('YYYY-MM-DD HH:mm:ss');
                    let kLineObj = kLine.find(el => el.timestamp === timestamp);
                    if (kLineObj) {
                        kLineObj.diff = diff;
                    }
                    else {
                        kLine.unshift({ timestamp, diff }); // 最新的数据放在最前面
                        let [, k1, k2, k3] = kLine;
                        if (k1 && k2 && k3) {
                            if (k1.diff > 0 && k2.diff > 0 && k3.diff > 0) { // 3 连涨
                                // buy
                                console.log('买');
                                // 以市价买
                                this.doBuy(coinFrom, coinTo, 'buy_market');
                            }
                            else if (k1.diff < 0 && k2.diff < 0 && k3.diff < 0) { // 3 连跌
                                // sell
                                console.log('卖');
                                // 以市价卖
                                this.doBuy(coinFrom, coinTo, 'sell_market');
                            }
                        }
                        if (kLine.length > 10) { // 只保存最近 10 条 K 线记录
                            kLine.pop();
                        }
                    }
                    if (diff < 0) { // 如果在跌，并且最低价低于买价，则卖
                        let { lastOrder } = this;
                        if (lastOrder && lastOrder.price > highPrice) { // 购买价大于当前K线的最高价，则卖
                            // sell 待实现
                        }
                    }
                });
            });
        });
    }
    async doBuy(coinFrom, coinTo, type, other = { price: 0, amount: 0 }) {
        let userInfo = await this.getUserInfo();
        if (userInfo.result) {
            let { info: { funds } } = userInfo;
            let params = { symbol: `${coinFrom}_${coinTo}`, type };
            switch (type) {
                case 'buy_market':
                    params.price = funds.free[coinTo];
                    break;
                case 'sell_market':
                    params.amount = funds.free[coinFrom];
                    break;
                case 'buy':
                    params = Object.assign({}, params, other);
                    break;
                case 'sell':
                    params = Object.assign({}, params, other);
                    break;
                default:
                    break;
            }
            let rs = await this.doTrade(params);
            if (rs.order_id) {
                let orderInfo;
                do {
                    orderInfo = await this.getOrderInfo(coinFrom, coinTo, rs.order_id);
                    if (orderInfo.result) {
                        break;
                    }
                    else {
                        await utils_1.wait(1000);
                    }
                } while (true);
                this.lastOrder = orderInfo.orders[0];
            }
            return rs.result;
        }
    }
}
exports.default = OkexStratege;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RyYXRlZ2UxLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbnN1bWVycy9va2V4L3N0cmF0ZWdlMS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLGtEQUEwQjtBQUMxQiwrQkFBK0I7QUFDL0IsMkNBQXVDO0FBRXZDLGtCQUFrQyxTQUFRLGNBQUk7SUFHMUMsWUFBWSxNQUFNLEVBQUUsU0FBUztRQUN6QixLQUFLLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBSDdCLFVBQUssR0FBUSxFQUFFLENBQUM7SUFJaEIsQ0FBQztJQUVELElBQUksQ0FBQyxRQUFRLEVBQUUsTUFBTSxFQUFFLENBQUM7UUFDcEIsSUFBSSxTQUFTLEdBQUcsUUFBUSxHQUFHLE1BQU0sR0FBRyxDQUFDLENBQUM7UUFDdEMsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDdkMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsRUFBRTtZQUN4QyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxFQUFFO2dCQUNkLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxFQUFFO29CQUNqQixJQUFJLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUMsRUFBRSxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUM7b0JBQ3hELElBQUksSUFBSSxHQUFHLFVBQVUsR0FBRyxTQUFTLENBQUM7b0JBQ2xDLHNFQUFzRTtvQkFDdEUsSUFBSSxRQUFRLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxTQUFTLEtBQUssU0FBUyxDQUFDLENBQUM7b0JBQzVELElBQUksUUFBUSxFQUFFO3dCQUNWLFFBQVEsQ0FBQyxJQUFJLEdBQUcs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