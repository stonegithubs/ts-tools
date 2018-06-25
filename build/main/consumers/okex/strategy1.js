"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const utils_1 = require("../../lib/utils");
const okex_1 = __importDefault(require("./okex"));
const { abs } = Math;
class OkexStrategy extends okex_1.default {
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
                    let [timestamp, openPrice, , , closePrice] = item;
                    let diff = closePrice - openPrice;
                    let time = moment_1.default(Number(timestamp)).format('YYYY-MM-DD HH:mm:ss');
                    console.log(time + '\t' + diff + '\t' + (diff > 0 ? '涨' : '跌'));
                    let kLineObj = kLine.find(tmp => tmp.timestamp === timestamp);
                    if (kLineObj) { // 每次 socket 推送更新 diff 数据
                        kLineObj.diff = diff;
                    }
                    else {
                        kLine.unshift({ timestamp, diff }); // 最新的数据放在最前面
                        if (kLine.length > 10) {
                            // 只保存最近 10 条 K 线记录
                            kLine.pop();
                        }
                    }
                    if (kLine.length > 10) {
                        // 只保存最近 10 条 K 线记录
                        kLine.pop();
                    }
                    let result1 = this.strategy1(kLine, { time }); // 策略关卡 1
                    let result2 = this.strategy2(item); // 策略关卡 2
                    let result3 = this.strategy3(item, 0.014);
                    if (result1 > 0) {
                        // buy
                    }
                    else if (result1 < 0 && result2 < 0 && result3 < 0) {
                        // sell
                    }
                });
            });
        });
    }
    // 返回值: 1 为 买, -1 为卖,  0 为忽略
    strategy1(kLine, other) {
        let [k0, k1, k2, k3] = kLine;
        if (k1 && k2 && k3) {
            if (k1.diff > 0 && k2.diff > 0 && k3.diff > 0) {
                // 3 连涨
                if (k0.diff > 0) {
                    // 3 连涨之后并且继续在涨
                    // buy
                    console.log(other.time + '\t买');
                    // 以市价买
                    // this.doBuy(other.coinFrom, other.coinTo, 'buy_market');
                    return 1;
                }
            }
            else if (k1.diff < 0 && k2.diff < 0 && k3.diff < 0) {
                // 3 连跌
                if (k0.diff < 0) {
                    // 3 连跌之后并且继续在跌
                    // sell
                    console.log(other.time + '\t卖');
                    // 以市价卖
                    // this.doBuy(other.coinFrom, other.coinTo, 'sell_market');
                    return -1;
                }
            }
        }
        return 0;
    }
    // 返回值: 1 为 买, -1 为卖,  0 为忽略
    strategy2(KLineObj) {
        let [, openPrice, highPrice, , closePrice] = KLineObj;
        let diff = closePrice - openPrice;
        if (diff < 0) {
            // 如果在跌，并且当前 K 线最高价低于买价，则卖
            let { lastOrder } = this;
            if (lastOrder && lastOrder.price > highPrice) {
                // 购买价大于当前 K 线的最高价，则卖
                // sell 待实现
                return -1;
                // this.doBuy(other.coinFrom, other.coinTo, 'sell_market');
            }
        }
        return 0;
    }
    // 返回值: 1 为 买, -1 为卖,  0 为忽略
    strategy3(KLineObj, swingLimit) {
        let [, openPrice, , , closePrice] = KLineObj;
        let diff = closePrice - openPrice;
        let swing = diff / closePrice; // 实体大小
        if (abs(swing) > swingLimit) { // 如果实体震动大小大于 swingLimit
            return diff > 0 ? 1 : -1; // 涨买跌卖
        }
        return 0;
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
exports.default = OkexStrategy;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RyYXRlZ3kxLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbnN1bWVycy9va2V4L3N0cmF0ZWd5MS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLG9EQUE0QjtBQUM1QiwyQ0FBdUM7QUFDdkMsa0RBQTBCO0FBRTFCLE1BQU0sRUFBRSxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUM7QUFFckIsa0JBQWtDLFNBQVEsY0FBSTtJQUc1QyxZQUFZLE1BQU0sRUFBRSxTQUFTO1FBQzNCLEtBQUssQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFIM0IsVUFBSyxHQUFRLEVBQUUsQ0FBQztJQUloQixDQUFDO0lBRUQsSUFBSSxDQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUUsQ0FBQztRQUN0QiwrQkFBK0I7UUFDL0IsSUFBSSxTQUFTLEdBQUcsUUFBUSxHQUFHLE1BQU0sR0FBRyxDQUFDLENBQUM7UUFDdEMsSUFBSSxLQUFLLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ3pDLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLEVBQUU7WUFDMUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsRUFBRTtnQkFDaEIsRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7b0JBQ3JCLElBQUksQ0FBQyxTQUFTLEVBQUUsU0FBUyxFQUFFLEFBQUQsRUFBRyxBQUFELEVBQUcsVUFBVSxDQUFDLEdBQUcsSUFBSSxDQUFDO29CQUNsRCxJQUFJLElBQUksR0FBRyxVQUFVLEdBQUcsU0FBUyxDQUFDO29CQUNsQyxJQUFJLElBQUksR0FBRyxnQkFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFD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