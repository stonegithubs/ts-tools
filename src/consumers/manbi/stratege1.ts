import Manbi from './manbi';
import util from 'util';

export default class ManbiStratege1 extends Manbi {
    static rate = 1/1000;
    static symbol = 'conieth';
    static symbolBuy = 'conieth';
    static symbolSell = 'conieth';
    constructor(apiid,secret, public disparityLimit = 0.000002) {
        super(apiid, secret);
    }
    run(): void {
        this.task();
    }
    async task (): Promise<void> {
        let [ balance, ticker, onlineOrders ] = await Promise.all([ this.getBalance(), this.geTicker(), this.getOrderBook()]);
        balance = formatBalance(balance.balance); // 个人账户余额
        ticker = ticker.ticker;  // 最新行情
        onlineOrders = onlineOrders;
        // let order = all[2].orderbook;  // 所有买卖挂单行情
        // let availableUSDT = balance.usdt.available;
        let availableETH = balance.eth.available;
        await this.processOrders(ticker);
        let availableCONI = balance.coni.available;
        return;
        if (availableETH > 0.01) {
            // buy
            let price = ticker[0].ask;
            // let price = ticker[0].bid;
            let quantity: any = availableETH/price;
            quantity = quantity / (1 + ManbiStratege1.rate);
            quantity = quantity.toString().match(/.*\..{2}/)[0];
            let ratePrice = quantity * ManbiStratege1.rate;
            let type = 'buy-limit';
            let symbol = ManbiStratege1.symbolBuy;
            let disparity = ticker[0].ask - ticker[0].bid;
            if (disparity > this.disparityLimit) {
                console.log(`交易差价过大,  差价为: ${disparity}\t 差价超过: ${this.disparityLimit}\n`)
                return;
            }
            let rs = await this.buyAndSell({ price, quantity, type, symbol });
            // buyOrderId = rs.orderid;
            // lastBuyPrice = price;
            console.log(`买入\n价格: ${price}\t买入数量: ${quantity}\t手续费: ${ratePrice}\t\n`, rs);
        }
        if(availableCONI > 1) {
            // sell
            let price = ticker[0].bid;
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
    async processOrders(ticker: object): Promise<any> {
        let myOrders = await this.getCurrentOrders({symbol: ManbiStratege1.symbol });
        myOrders = formatOrders(myOrders.orders.result);
        myOrders.buyes.forEach(el => {
            // if (el.)
        })
        myOrders.sells.forEach(async el => {
            if (el.price - ticker[0].bid > 0.00001) {
                // 撤单
                if (el.orderstatus === 'unfilled' || (el.orderstatus === 'partialFilled')) {
                    let data = await this.cancelOrder(el.orderid);
                    console.log('撤单成功，撤单信息:', util.inspect(data));
                }
            }
        })
    }
}

function formatBalance(arrBalance: any[]): any {
    let data = {} as any;
    arrBalance.forEach(el => {
        data[el.asset.toLowerCase()] = el;
    });
    return data;
}

function formatOrders(orders: any[]) : any{
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