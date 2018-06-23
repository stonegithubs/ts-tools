"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const manbi_1 = __importDefault(require("./manbi"));
const util_1 = __importDefault(require("util"));
const moment_1 = __importDefault(require("moment"));
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
        await this.processOrders(ticker);
        let availableCONI = balance.coni.available;
        if (availableETH > 0.01) {
            // buy
            // let price = ticker[0].ask;
            let price = this.buyNum == -1 ? ticker[0].ask : onlineOrders.orderbook.bids[this.buyNum - 1].price;
            // let price = ticker[0].bid;
            let quantity = availableETH / price;
            quantity = quantity / (1 + ManbiStratege1.rate);
            quantity = quantity.toString().match(/.*\..{2}/)[0];
            let ratePrice = quantity * ManbiStratege1.rate;
            let type = 'buy-limit';
            let symbol = ManbiStratege1.symbolBuy;
            // let disparity = ticker[0].ask - ticker[0].bid;
            // if (disparity > this.disparityLimit) {
            //     console.log(`交易差价过大,  差价为: ${disparity}\t 差价超过: ${this.disparityLimit}\n`)
            //     return;
            // }
            let rs = await this.buyAndSell({ price, quantity, type, symbol });
            console.log(`买入\n价格: ${price}\t买入数量: ${quantity}\t手续费: ${ratePrice}\t\n`, rs);
        }
        if (availableCONI > 1) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RyYXRlZ2UxLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbnN1bWVycy9tYW5iaS9zdHJhdGVnZTEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxvREFBNEI7QUFDNUIsZ0RBQXdCO0FBQ3hCLG9EQUE0QjtBQUU1QixvQkFBb0MsU0FBUSxlQUFLO0lBTTdDLFlBQVksS0FBSyxFQUFFLE1BQU0sRUFBUyxTQUFTLENBQUMsRUFBUyxVQUFVLENBQUMsRUFBUyxpQkFBaUIsUUFBUSxFQUFTLFlBQVksR0FBRyxFQUFTLGVBQWUsQ0FBQztRQUMvSSxLQUFLLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBRFMsV0FBTSxHQUFOLE1BQU0sQ0FBSTtRQUFTLFlBQU8sR0FBUCxPQUFPLENBQUk7UUFBUyxtQkFBYyxHQUFkLGNBQWMsQ0FBVztRQUFTLGNBQVMsR0FBVCxTQUFTLENBQU07UUFBUyxpQkFBWSxHQUFaLFlBQVksQ0FBSTtJQUVuSixDQUFDO0lBQ0QsR0FBRztRQUNDLElBQUksQ0FBQyxNQUFNLEdBQUcsV0FBVyxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsRUFBRSxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxDQUFDO0lBQzNFLENBQUM7SUFDRCxJQUFJO1FBQ0EsYUFBYSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUMvQixDQUFDO0lBQ0QsS0FBSyxDQUFDLElBQUk7UUFDTixJQUFJLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxZQUFZLENBQUMsR0FBRyxNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxFQUFFLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDbkgsT0FBTyxHQUFHLGFBQWEsQ0FBQyxPQUFPLENBQUMsT0FBTyxD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