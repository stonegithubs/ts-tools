"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const util_1 = __importDefault(require("util"));
const manbi_1 = __importDefault(require("./manbi"));
class ManbiStratege1 extends manbi_1.default {
    constructor(apiid, secret, buyNum = 1, sellNum = 1, disparityLimit = 0.000002, timelimit = 4.5, taskInterval = 5) {
        super(apiid, secret);
        this.buyNum = buyNum;
        this.sellNum = sellNum;
        this.disparityLimit = disparityLimit;
        this.timelimit = timelimit;
        this.taskInterval = taskInterval;
    }
    run() {
        // this.task();
        this.taskId = setInterval(() => this.task(), this.taskInterval * 1000);
    }
    stop() {
        clearInterval(this.taskId);
    }
    async task() {
        let [balance, ticker, onlineOrders] = await Promise.all([this.getBalance(), this.geTicker(), this.getOrderBook()]);
        balance = formatBalance(balance.balance); // 个人账户余额
        ticker = ticker.ticker; // 最新行情
        onlineOrders = onlineOrders;
        // let order = all[2].orderbook;  // 所有买卖挂单行情
        // let availableUSDT = balance.usdt.available;
        let availableETH = balance.eth.available;
        // await this.processOrders(ticker);  // 处理线上挂单，超过3分钟订单等
        let availableCONI = balance.coni.available;
        if (availableETH > 0.01) {
            // buy
            // let price = ticker[0].ask;
            // let price = this.buyNum == -1 ? ticker[0].ask : onlineOrders.orderbook.bids[this.buyNum - 1].price;
            // let price = ticker[0].bid;
            let bigBid = this.getOvertopCount(onlineOrders.orderbook.bids, 3, 10000); // 单量超过 1 万算大单
            let price = bigBid.price;
            let quantity = availableETH / price;
            quantity = quantity / (1 + ManbiStratege1.rate);
            quantity = quantity.toString().match(/.*\..{2}/)[0];
            let ratePrice = quantity * ManbiStratege1.rate;
            let type = 'buy-limit';
            let symbol = ManbiStratege1.symbolBuy;
            let disparity = ticker[0].ask - ticker[0].bid;
            if (disparity > this.disparityLimit) {
                console.log(`交易差价过大,  差价为: ${disparity}\t 差价超过: ${this.disparityLimit}\n`);
                return;
            }
            let rs = await this.buyAndSell({ price, quantity, type, symbol });
            if (rs.status === 'ok') {
                // sell
                let orderstatus = '';
                let order;
                do {
                    try {
                        order = await this.getOrderInfo(rs.orderid);
                        await new Promise(res => setTimeout(() => res(), 2000));
                    }
                    catch (error) {
                        //
                    }
                    orderstatus = order && order.order && order.order.orderstatus;
                } while (orderstatus != 'filled'); // 直到订单完成
                let bigAsk = this.getOvertopCount(onlineOrders.orderbook.asks, 3, 10000); // 单量超过 1 万算大单
                price = bigAsk.price;
                type = 'sell-limit';
                symbol = ManbiStratege1.symbolSell;
                rs = await this.buyAndSell({ price, quantity, type, symbol });
            }
            console.log(`买入\n价格: ${price}\t买入数量: ${quantity}\t手续费: ${ratePrice}\t\n`, rs);
        }
        // 原来的卖的方案, 使用 false 关闭
        if (false && availableCONI > 1) {
            // sell
            // let price = ticker[0].bid;
            let price = this.sellNum == -1 ? ticker[0].bid : onlineOrders.orderbook.asks[this.sellNum - 1].price;
            // let price = ticker[0].ask;
            let quantity = balance.coni.available;
            let ratePrice = quantity * ManbiStratege1.rate;
            quantity = quantity.toString().match(/.*\..{2}/)[0];
            let type = 'sell-limit';
            let symbol = ManbiStratege1.symbolSell;
            let rs = await this.buyAndSell({ price, quantity, type, symbol });
            console.log(`卖出\n价格: ${price}\t卖出数量: ${quantity}\t手续费: ${ratePrice}\t\n`, rs);
        }
        console.log(`\n循环一轮\n可用coni: ${availableCONI}\t可用eth: ${availableETH}\n`);
    }
    async processOrders(ticker) {
        let myOrders = await this.getCurrentOrders({ symbol: ManbiStratege1.symbol });
        let now = moment_1.default(myOrders.timestamp);
        if (!myOrders.orders)
            return;
        myOrders = formatOrders(myOrders.orders.result);
        myOrders.buyes.forEach(async (el) => {
            let createTime = moment_1.default(el.createtime).subtract(8, 'hours'); // 减去时差
            createTime.add(this.timelimit, 'minutes'); // 取创建时间后3分钟
            if (createTime.toDate() < now.toDate()) { // 如果创建时间后 3 分钟大于现在时间， 则相当于挂单 3 分钟未成交， 则撤单
                if (el.orderstatus === 'unfilled' || (el.orderstatus === 'partialFilled')) {
                    let data = await this.cancelOrder(el.orderid);
                    if (data.status === 'ok') {
                        console.log('撤单成功，撤单信息:', util_1.default.inspect(data));
                    }
                    else {
                        console.log('撤单失败', data.description);
                    }
                }
            }
        });
        myOrders.sells.forEach(async (el) => {
            let createTime = moment_1.default(el.createtime).subtract(8, 'hours'); // 减去时差
            createTime.add(this.timelimit, 'minutes'); // 取创建时间后3分钟
            if ((el.price - ticker[0].bid > 0.00001) || (createTime.toDate() < now.toDate())) { // 如果创建时间后 3 分钟大于现在时间， 则相当于挂单 3 分钟未成交， 则撤单
                // 撤单
                if (el.orderstatus === 'unfilled' || (el.orderstatus === 'partialFilled')) {
                    let data = await this.cancelOrder(el.orderid);
                    if (data.status === 'ok') {
                        console.log('撤单成功，撤单信息:', util_1.default.inspect(data));
                    }
                    else {
                        console.log('撤单失败', data.description);
                    }
                }
            }
        });
    }
    // 获取大单的前一个单， 作为卖的价格
    getOvertopCount(orderList = [], limit = 100000000, count = 10000) {
        let rt;
        for (let index = 0, l = orderList.length; index < l; index++) {
            let el = orderList[index];
            if (el.quantity >= count) {
                rt = index > 0 ? orderList[index - 1] : el;
                return rt;
            }
            if (index > limit) {
                return el;
            }
        }
        return {};
    }
}
ManbiStratege1.rate = 1 / 1000;
ManbiStratege1.symbol = 'conieth';
ManbiStratege1.symbolBuy = 'conieth';
ManbiStratege1.symbolSell = 'conieth';
exports.default = ManbiStratege1;
function formatBalance(arrBalance) {
    let data = {};
    arrBalance.forEach(el => {
        data[el.asset.toLowerCase()] = el;
    });
    return data;
}
function formatOrders(orders) {
    let data = {};
    data.sells = [];
    data.buyes = [];
    orders.forEach(el => {
        if (el.type === 'sell-limit') {
            data.sells.push(el);
        }
        else if (el.type === 'buy-limit') {
            data.buyes.push(el);
        }
    });
    return data;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RyYXRlZ2UxLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbnN1bWVycy9tYW5iaS9zdHJhdGVnZTEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxvREFBNEI7QUFDNUIsZ0RBQXdCO0FBQ3hCLG9EQUE0QjtBQUU1QixvQkFBb0MsU0FBUSxlQUFLO0lBTTdDLFlBQVksS0FBSyxFQUFFLE1BQU0sRUFBUyxTQUFTLENBQUMsRUFBUyxVQUFVLENBQUMsRUFBUyxpQkFBaUIsUUFBUSxFQUFTLFlBQVksR0FBRyxFQUFTLGVBQWUsQ0FBQztRQUMvSSxLQUFLLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBRFMsV0FBTSxHQUFOLE1BQU0sQ0FBSTtRQUFTLFlBQU8sR0FBUCxPQUFPLENBQUk7UUFBUyxtQkFBYyxHQUFkLGNBQWMsQ0FBVztRQUFTLGNBQVMsR0FBVCxTQUFTLENBQU07UUFBUyxpQkFBWSxHQUFaLFlBQVksQ0FBSTtJQUVuSixDQUFDO0lBQ0QsR0FBRztRQUNDLGVBQWU7UUFDZixJQUFJLENBQUMsTUFBTSxHQUFHLFdBQVcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUUsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsQ0FBQztJQUMzRSxDQUFDO0lBQ0QsSUFBSTtRQUNBLGFBQWEsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDL0IsQ0FBQztJQUNELEtBQUssQ0FBQyxJQUFJO1FBQ04sSUFBSSxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsWUFBWSxDQUFDLEdBQUcsTUFBTSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFBRSxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ25ILE9BQU8sR0FBRyxhQUFhLENBQUMsT0FBTyxD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