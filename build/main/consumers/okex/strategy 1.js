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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RyYXRlZ3kgMS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb25zdW1lcnMvb2tleC9zdHJhdGVneSAxLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsb0RBQTRCO0FBQzVCLDJDQUF1QztBQUN2QyxrREFBMEI7QUFFMUIsa0JBQWtDLFNBQVEsY0FBSTtJQUc1QyxZQUFZLE1BQU0sRUFBRSxTQUFTO1FBQzNCLEtBQUssQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFIM0IsVUFBSyxHQUFRLEVBQUUsQ0FBQztJQUloQixDQUFDO0lBRUQsSUFBSSxDQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUUsQ0FBQztRQUN0QiwrQkFBK0I7UUFDL0IsSUFBSSxTQUFTLEdBQUcsUUFBUSxHQUFHLE1BQU0sR0FBRyxDQUFDLENBQUM7UUFDdEMsSUFBSSxLQUFLLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ3pDLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLEVBQUU7WUFDMUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsRUFBRTtnQkFDaEIsRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7b0JBQ3JCLElBQUksQ0FBQyxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxBQUFELEVBQUcsVUFBVSxDQUFDLEdBQUcsSUFBSSxDQUFDO29CQUMzRCxJQUFJLElBQUksR0FBRyxVQUFVLEdBQUcsU0FBUyxDQUFDO29CQUNsQyxJQUFJLElBQUksR0FBRyxnQkFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO29CQUNuRSxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxJ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