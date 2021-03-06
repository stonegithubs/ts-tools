import moment from 'moment';
import util from 'util';
import Manbi from './manbi';

export default class ManbiStrategy1 extends Manbi {
    static rate = 1 / 1000;
    static symbol = 'conieth';
    static symbolBuy = 'conieth';
    static symbolSell = 'conieth';
    public taskId: any;
    constructor(apiid, secret, public buyNum = 1, public sellNum = 1, public disparityLimit = 0.000002, public timelimit = 4.5, public taskInterval = 5) {
        super(apiid, secret);
    }
    run(): void {
        // this.task();
        this.taskId = setInterval(() => this.task(), this.taskInterval * 1000);
    }
    stop(): void {
        clearInterval(this.taskId);
    }
    async task(): Promise<void> {
        let [balance, ticker, onlineOrders] = await Promise.all([this.getBalance(), this.geTicker(), this.getOrderBook()]);
        balance = formatBalance(balance.balance); // 个人账户余额
        ticker = ticker.ticker;  // 最新行情
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
            let quantity: any = availableETH / price;
            quantity = quantity / (1 + ManbiStrategy1.rate);
            quantity = quantity.toString().match(/.*\..{2}/)[0];
            let ratePrice = quantity * ManbiStrategy1.rate;
            let type = 'buy-limit';
            let symbol = ManbiStrategy1.symbolBuy;
            let disparity = ticker[0].ask - ticker[0].bid;
            if (disparity > this.disparityLimit) {
                console.log(`交易差价过大,  差价为: ${disparity}\t 差价超过: ${this.disparityLimit}\n`)
                return;
            }
            let rs = await this.buyAndSell({ price, quantity, type, symbol });
            if (rs.status === 'ok') {
                // sell
                let orderstatus = '';
                let order;
                do{
                    try {
                    order = await this.getOrderInfo(rs.orderid);
                    await new Promise(res => setTimeout(() => res(), 2000));
                    } catch (error) {
                        //
                    }
                    orderstatus = order && order.order && order.order.orderstatus;
                } while(orderstatus != 'filled'); // 直到订单完成
                let bigAsk = this.getOvertopCount(onlineOrders.orderbook.asks, 3, 10000); // 单量超过 1 万算大单
                price = bigAsk.price;
                type = 'sell-limit';
                symbol = ManbiStrategy1.symbolSell;
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
            let ratePrice = quantity * ManbiStrategy1.rate;
            quantity = quantity.toString().match(/.*\..{2}/)[0];
            let type = 'sell-limit';
            let symbol = ManbiStrategy1.symbolSell;
            let rs = await this.buyAndSell({ price, quantity, type, symbol });
            console.log(`卖出\n价格: ${price}\t卖出数量: ${quantity}\t手续费: ${ratePrice}\t\n`, rs);
        }
        console.log(`\n循环一轮\n可用coni: ${availableCONI}\t可用eth: ${availableETH}\n`);
    }
    async processOrders(ticker: object): Promise<any> {
        let myOrders = await this.getCurrentOrders({ symbol: ManbiStrategy1.symbol });
        let now = moment(myOrders.timestamp);
        if (!myOrders.orders) return;
        myOrders = formatOrders(myOrders.orders.result);
        myOrders.buyes.forEach(async el => {
            let createTime = moment(el.createtime).subtract(8, 'hours'); // 减去时差
            createTime.add(this.timelimit, 'minutes'); // 取创建时间后3分钟
            if (createTime.toDate() < now.toDate()) { // 如果创建时间后 3 分钟大于现在时间， 则相当于挂单 3 分钟未成交， 则撤单
                if (el.orderstatus === 'unfilled' || (el.orderstatus === 'partialFilled')) {
                    let data = await this.cancelOrder(el.orderid);
                    if (data.status === 'ok') {
                        console.log('撤单成功，撤单信息:', util.inspect(data));
                    } else {
                        console.log('撤单失败', data.description);
                    }
                }
            }
        })
        myOrders.sells.forEach(async el => {
            let createTime = moment(el.createtime).subtract(8, 'hours'); // 减去时差
            createTime.add(this.timelimit, 'minutes'); // 取创建时间后3分钟

            if ((el.price - ticker[0].bid > 0.00001) || (createTime.toDate() < now.toDate())) { // 如果创建时间后 3 分钟大于现在时间， 则相当于挂单 3 分钟未成交， 则撤单
                // 撤单
                if (el.orderstatus === 'unfilled' || (el.orderstatus === 'partialFilled')) {
                    let data = await this.cancelOrder(el.orderid);
                    if (data.status === 'ok') {
                        console.log('撤单成功，撤单信息:', util.inspect(data));
                    } else {
                        console.log('撤单失败', data.description);
                    }
                }
            }
        })
    }

    // 获取大单的前一个单， 作为卖的价格
    getOvertopCount(orderList: any[] = [], limit = 100000000, count = 10000): any {
        let rt: any;
        for(let index = 0,l = orderList.length; index < l; index++) {
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

function formatBalance(arrBalance: any[]): any {
    let data = {} as any;
    arrBalance.forEach(el => {
        data[el.asset.toLowerCase()] = el;
    });
    return data;
}

function formatOrders(orders: any[]): any {
    let data = {} as any;
    data.sells = [];
    data.buyes = [];
    orders.forEach(el => {
        if (el.type === 'sell-limit') {
            data.sells.push(el);
        } else if (el.type === 'buy-limit') {
            data.buyes.push(el);
        }
    })
    return data;
}