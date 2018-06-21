

import Manbi from './manbi';

const symbol_buy = 'conieth';
const symbol_sell = 'conieth';

let appid = '';
let secret = '';
let manbi = new Manbi(appid, secret);

async function task () {
    let all = await Promise.all([ manbi.getBalance(), manbi.geTicker(), manbi.getOrderBook()]);
    let balance = formatBalance(all[0].balance); // 个人账户余额
    let ticker = all[1].ticker;  // 最新行情
    // let order = all[2].orderbook;  // 所有买卖挂单行情
    let availableUSDT = balance.usdt.available;
    let availableCONI = balance.coni.available;
    if (availableUSDT > 1) {
        // buy
        let price = ticker[0].ask;
        let quantity = availableUSDT/price;
        let type = 'buy-limit';
        let symbol = symbol_buy;

        manbi.buyAndSell({ price, quantity, type, symbol });
    }
    if(availableCONI > 1) {
        // sell
        let price = ticker[0].bid;
        let quantity = balance.coni.available;
        let type = 'sell-limit';
        let symbol = symbol_sell;
        manbi.buyAndSell({ price, quantity, type, symbol });
    }
}

task();

function formatBalance(b) {
    let data = {} as any;
    b.forEach(el => {
        data[el.asset.toLowerCase()] = el;
    });
    return data;
}