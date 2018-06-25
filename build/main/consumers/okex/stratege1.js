"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const utils_1 = require("../../lib/utils");
const okex_1 = __importDefault(require("./okex"));
class OkexStratege extends okex_1.default {
    constructor(apiKey, secretKey) {
        super(apiKey, secretKey);
        this.kLine = {};
    }
    task(coinFrom, coinTo, Y) {
        // 3连涨或者连跌，如果没出现连跌但是已经比买的价格低了就卖
        let kLineName = coinFrom + coinTo + Y;
        let kLine = (this.kLine[kLineName] = []);
        this.wsSubKLine(coinFrom, coinTo, Y, data => {
            data.forEach(el => {
                el.data.forEach(item => {
                    let [timestamp, openPrice, highPrice, , closePrice] = item;
                    let diff = closePrice - openPrice;
                    let time = moment_1.default(Number(timestamp)).format('YYYY-MM-DD HH:mm:ss');
                    console.log(time + '\t' + diff + '\t' + (diff > 0 ? '涨' : '跌'));
                    let kLineObj = kLine.find(tmp => tmp.timestamp === timestamp);
                    if (kLineObj) {
                        kLineObj.diff = diff;
                    }
                    else {
                        kLine.unshift({ timestamp, diff }); // 最新的数据放在最前面
                    }
                    this.strategy1(kLine, { time });
                    if (diff < 0) {
                        // 如果在跌，并且最低价低于买价，则卖
                        let { lastOrder } = this;
                        if (lastOrder && lastOrder.price > highPrice) {
                            // 购买价大于当前K线的最高价，则卖
                            // sell 待实现
                        }
                    }
                });
            });
        });
    }
    strategy1(kLine, othoer) {
        let [k0, k1, k2, k3] = kLine;
        if (k1 && k2 && k3) {
            if (k1.diff > 0 && k2.diff > 0 && k3.diff > 0) {
                // 3 连涨
                if (k0.diff > 0) { // 3 连涨之后并且继续在涨
                    // buy
                    console.log(othoer.time + '\t买');
                    // 以市价买
                    // this.doBuy(coinFrom, coinTo, 'buy_market');
                }
            }
            else if (k1.diff < 0 && k2.diff < 0 && k3.diff < 0) {
                // 3 连跌
                if (k0.diff < 0) { // 3 连跌之后并且继续在跌
                    // sell
                    console.log(othoer.time + '\t卖');
                    // 以市价卖
                    // this.doBuy(coinFrom, coinTo, 'sell_market');
                }
            }
        }
        if (kLine.length > 10) {
            // 只保存最近 10 条 K 线记录
            kLine.pop();
        }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RyYXRlZ2UxLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbnN1bWVycy9va2V4L3N0cmF0ZWdlMS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLG9EQUE0QjtBQUM1QiwyQ0FBdUM7QUFDdkMsa0RBQTBCO0FBRTFCLGtCQUFrQyxTQUFRLGNBQUk7SUFHNUMsWUFBWSxNQUFNLEVBQUUsU0FBUztRQUMzQixLQUFLLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBSDNCLFVBQUssR0FBUSxFQUFFLENBQUM7SUFJaEIsQ0FBQztJQUVELElBQUksQ0FBQyxRQUFRLEVBQUUsTUFBTSxFQUFFLENBQUM7UUFDdEIsK0JBQStCO1FBQy9CLElBQUksU0FBUyxHQUFHLFFBQVEsR0FBRyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1FBQ3RDLElBQUksS0FBSyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUN6QyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUFFO1lBQzFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLEVBQUU7Z0JBQ2hCLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFO29CQUNyQixJQUFJLENBQUMsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsQUFBRCxFQUFHLFVBQVUsQ0FBQyxHQUFHLElBQUksQ0FBQztvQkFDM0QsSUFBSSxJQUFJLEdBQUcsVUFBVSxHQUFHLFNBQVMsQ0FBQztvQkFDbEMsSUFBSSxJQUFJLEdBQUcsZ0JBQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMscUJBQXFCLENBQUMsQ0FBQztvQkFDbkUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsSUFBSSxHQUFHLElBQUksR0FBRyxJQUFJLEdBQUcsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBRWhFLElBQUksUUFBUSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsU0FBUyxLQUFLLFNBQVMsQ0FBQyxDQUFDO29CQUM5RCxJQUFJLFFBQVEsRUFBRTt3QkFDWixRQUFRLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztxQkFDdEI7eUJBQU07d0JBQ0wsS0FBSyxDQUFDLE9BQU8sQ0FBQyxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsYUFBYTtxQkFDbEQ7b0JBRUQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO29CQUVoQyxJQUFJLElBQUksR0FBRyxDQUFDLEVBQUU7d0JBQ1osb0JBQW9CO3dCQUNwQixJQUFJLEVBQUUsU0FBUyxFQUFFLEdBQUcsSUFBSSxDQUFDO3dCQUN6QixJQUFJLFNBQVMsSUFBSSxTQUFTLENBQUMsS0FBSyxHQUFHLFNBQVMsRUFBRTs0QkFDNUMsbUJBQW1COzRCQUNuQixXQUFXO3lCQUNaO3FCQUNGO2dCQUNILENBQUMsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxTQUFTLENBQUMsS0FBWSxFQUFFLE1BQU87UUFDN0IsSUFBSSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQztRQUM3QixJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxFQUFFO1lBQ2xCLElBQUksRUFBRSxDQUFDLElBQUksR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDLElBQUksR0FBRyxDQUFDLEVBQUU7Z0JBQzdDLE9BQU87Z0JBQ1AsSUFBRyxFQUFFLENBQUMsSUFBSSxHQUFHLENBQUMsRUFBRSxFQUFFLGVBQWU7b0JBQzdCLE1BQU07b0JBQ04sT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxDQUFDO29CQUNqQyxPQUFPO29CQUNQLDhDQUE4QztpQkFDakQ7YUFDRjtpQkFBTSxJQUFJLEVBQUUsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxFQUFFO2dCQUNwRCxPQUFPO2dCQUNQLElBQUksRUFBRSxDQUFDLElBQUksR0FBRyxDQUFDLEVBQUUsRUFBRSxlQUFlO29CQUM5QixPQUFPO29CQUNQLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsQ0FBQztvQkFDakMsT0FBTztvQkFDUCwrQ0FBK0M7aUJBQ2xEO2FBQ0Y7U0FDRjtRQUNELElBQUksS0FBSyxDQUFDLE1BQU0sR0FBRyxFQUFFLEVBQUU7WUFDckIsbUJBQW1CO1lBQ25CLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQztTQUNiO0lBQ0gsQ0FBQztJQUVELEtBQUssQ0FBQyxLQUFLLENBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsUUFBMkIsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUU7UUFDckYsSUFBSSxRQUFRLEdBQUcsTUFBTSxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDeEMsSUFBSSxRQUFRLENBQUMsTUFBTSxFQUFFO1lBQ25CLElBQUksRUFBRSxJQUFJLEVBQUUsRUFBRSxLQUFLLEVBQUUsRUFBRSxHQUFHLFFBQVEsQ0FBQztZQUNuQyxJQUFJLE1BQU0sR0FBUSxFQUFFLE1BQU0sRUFBRSxHQUFHLFFBQVEsSUFBSSxNQUFNLEVBQUUsRUFBRSxJQUFJLEVBQUUsQ0FBQztZQUM1RCxRQUFRLElBQUksRUFBRTtnQkFDWixLQUFLLFlBQVk7b0JBQ2YsTUFBTSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO29CQUNsQyxNQUFNO2dCQUNSLEtBQUssYUFBYTtvQkFDaEIsTUFBTSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUNyQyxNQUFNO2dCQUNSLEtBQUssS0FBSztvQkFDUixNQUFNLHFCQUFRLE1BQU0sRUFBSyxLQUFLLENBQUUsQ0FBQztvQkFDakMsTUFBTTtnQkFDUixLQUFLLE1BQU07b0JBQ1QsTUFBTSxxQkFBUSxNQUFNLEVBQUssS0FBSyxDQUFFLENBQUM7b0JBQ2pDLE1BQU07Z0JBQ1I7b0JBQ0UsTUFBTTthQUNUO1lBQ0QsSUFBSSxFQUFFLEdBQUcsTUFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3BDLElBQUksRUFBRSxDQUFDLFFBQVEsRUFBRTtnQkFDZixJQUFJLFNBQVMsQ0FBQztnQkFDZCxHQUFHO29CQUNELFNBQVMsR0FBRyxNQUFNLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRSxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUM7b0JBQ25FLElBQUksU0FBUyxDQUFDLE1BQU0sRUFBRTt3QkFDcEIsTUFBTTtxQkFDUDt5QkFBTTt3QkFDTCxNQUFNLFlBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztxQkFDbEI7aUJBQ0YsUUFBUSxJQUFJLEVBQUU7Z0JBQ2YsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ3RDO1lBQ0QsT0FBTyxFQUFFLENBQUMsTUFBTSxDQUFDO1NBQ2xCO0lBQ0gsQ0FBQztDQUNGO0FBekdELCtCQXlHQyJ9