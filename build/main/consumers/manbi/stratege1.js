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
            let price = onlineOrders.orderbook.bids[this.buyNum - 1].price;
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
            // buyOrderId = rs.orderid;
            // lastBuyPrice = price;
            console.log(`买入\n价格: ${price}\t买入数量: ${quantity}\t手续费: ${ratePrice}\t\n`, rs);
        }
        if (availableCONI > 1) {
            // sell
            // let price = ticker[0].bid;
            let price = onlineOrders.orderbook.asks[this.sellNum - 1].price;
            // let price = ticker[0].ask;
            let quantity = balance.coni.available;
            let ratePrice = quantity * ManbiStratege1.rate;
            quantity = quantity.toString().match(/.*\..{2}/)[0];
            let type = 'sell-limit';
            let symbol = ManbiStratege1.symbolSell;
            let rs = await this.buyAndSell({ price, quantity, type, symbol });
            // lastSellPrice = price;
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
            if (el.price - ticker[0].bid > 0.00001) {
                // 撤单
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RyYXRlZ2UxLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbnN1bWVycy9tYW5iaS9zdHJhdGVnZTEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxvREFBNEI7QUFDNUIsZ0RBQXdCO0FBQ3hCLG9EQUE0QjtBQUU1QixvQkFBb0MsU0FBUSxlQUFLO0lBTTdDLFlBQVksS0FBSyxFQUFDLE1BQU0sRUFBUyxTQUFTLENBQUMsRUFBUyxVQUFVLENBQUMsRUFBUyxpQkFBaUIsUUFBUSxFQUFTLFlBQVksR0FBRyxFQUFTLGVBQWUsQ0FBQztRQUM5SSxLQUFLLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBRFEsV0FBTSxHQUFOLE1BQU0sQ0FBSTtRQUFTLFlBQU8sR0FBUCxPQUFPLENBQUk7UUFBUyxtQkFBYyxHQUFkLGNBQWMsQ0FBVztRQUFTLGNBQVMsR0FBVCxTQUFTLENBQU07UUFBUyxpQkFBWSxHQUFaLFlBQVksQ0FBSTtJQUVsSixDQUFDO0lBQ0QsR0FBRztRQUNDLElBQUksQ0FBQyxNQUFNLEdBQUcsV0FBVyxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsRUFBRSxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxDQUFDO0lBQzNFLENBQUM7SUFDRCxJQUFJO1FBQ0EsYUFBYSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUMvQixDQUFDO0lBQ0QsS0FBSyxDQUFDLElBQUk7UUFDTixJQUFJLENBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxZQUFZLENBQUUsR0FBRyxNQUFNLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBRSxJQUFJLENBQUMsVUFBVSxFQUFFLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxFQUFFLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDdEgsT0FBTyxHQUFHLGFBQWEsQ0FBQyxPQUFPLENBQUMsT0FBTyxD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