

import Manbi from './manbi';

const symbolBuy = 'conieth';
const symbolSell = 'conieth';

let appid = '4d5e700a2da135ad586dbcb8eebe13c8';
let secret = '59cf464fe5604c21b1d6e20db234aa11';
let rate = 1/1000;
let lastBuyPrice = 0;
let lastSellPrice = 0;
let buyOrderId = '';
let disparityLimit = 0.000002;
let buyOrder
let manbi = new Manbi(appid, secret);

async function task (): Promise<void> {
    let all = await Promise.all([ manbi.getBalance(), manbi.geTicker(), manbi.getOrderBook()]);
    let balance = formatBalance(all[0].balance); // 个人账户余额
    let ticker = all[1].ticker;  // 最新行情
    // let order = all[2].orderbook;  // 所有买卖挂单行情
    let availableUSDT = balance.usdt.available;
    let availableETH = balance.eth.available;
    let availableCONI = balance.coni.available;
    if (availableETH > 0.01) {
        // buy
        let price = ticker[0].ask;
        // let price = ticker[0].bid;
        let quantity: any = availableETH/price;
        quantity = quantity / (1 + rate);
        quantity = quantity.toString().match(/.*\..{2}/)[0];
        let ratePrice = quantity * rate;
        let type = 'buy-limit';
        let symbol = symbolBuy;
        let disparity = ticker[0].ask - ticker[0].bid;
        if (disparity > disparityLimit) {
            console.log(`交易差价过大,  差价为: ${disparity}\t 差价超过: ${disparityLimit}\n`)
            return;
        }
        let rs = await manbi.buyAndSell({ price, quantity, type, symbol });
        buyOrderId = rs.orderid;
        lastBuyPrice = price;
        console.log(`买入\n价格: ${price}\t买入数量: ${quantity}\t手续费: ${ratePrice}\t\n`, rs);
    }
    if(availableCONI > 1) {
        // sell
        let price = ticker[0].bid;
        // let price = ticker[0].ask;
        let quantity = balance.coni.available;
        let ratePrice = quantity * rate;
        quantity = quantity.toString().match(/.*\..{2}/)[0];
        let type = 'sell-limit';
        let symbol = symbolSell;
        let rs = await manbi.buyAndSell({ price, quantity, type, symbol });
        lastSellPrice = price;
        console.log(`卖出\n价格: ${price}\t卖出数量: ${quantity}\t手续费: ${ratePrice}\t\n`, rs);
    }
    console.log(`\n循环一轮\n可用coni: ${availableCONI}\t可用eth: ${availableETH}\n`);
}

// setInterval(task, 1000);

// manbi.getOrderInfo({ orderid: '201806221259554170016382' }).then(data => {
//     console.log(data)
// })

manbi.getCurrentOrders({ symbol: 'conieth' }).then(data => {
    console.log(data)
})

function formatBalance(arrBalance: any[]): any {
    let data = {} as any;
    arrBalance.forEach(el => {
        data[el.asset.toLowerCase()] = el;
    });
    return data;
}