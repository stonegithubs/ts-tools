import Okex from './okex';
// import moment from 'moment';
import { wait } from '../../lib/utils';

export default class OkexStratege extends Okex {
    kLine: any = {};
    lastOrder: any;
    constructor(apiKey, secretKey) {
        super(apiKey, secretKey);
    }

    task(coinFrom, coinTo, Y) {  // 3连涨或者连跌，如果没出现连跌但是已经比买的价格低了就卖
        let kLineName = coinFrom + coinTo + Y;
        let kLine = this.kLine[kLineName] = [];
        this.wsSubKLine(coinFrom, coinTo, Y, data => {
            data.forEach(el => {
                el.data.forEach(el => {
                    let [timestamp, openPrice, highPrice,, closePrice] = el;
                    let diff = closePrice - openPrice;
                    // let time = moment(Number(timestamp)).format('YYYY-MM-DD HH:mm:ss');
                    let kLineObj = kLine.find(el => el.timestamp === timestamp);
                    if (kLineObj) {
                        kLineObj.diff = diff;
                    } else {
                        kLine.unshift({ timestamp, diff });  // 最新的数据放在最前面
                        let [, k1, k2, k3] = kLine;
                        if (k1 && k2 && k3) {
                            if (k1.diff > 0 && k2.diff > 0 && k3.diff > 0) {  // 3 连涨
                                // buy
                                console.log('买');
                                // 以市价买
                                this.doBuy(coinFrom, coinTo, 'buy_market');
                            } else if (k1.diff < 0 && k2.diff < 0 && k3.diff < 0) {  // 3 连跌
                                // sell
                                console.log('卖');
                                // 以市价卖
                                this.doBuy(coinFrom, coinTo, 'sell_market');
                            }
                        }
                        if (kLine.length > 10) {  // 只保存最近 10 条 K 线记录
                            kLine.pop();
                        }
                    }
                    if (diff < 0) { // 如果在跌，并且最低价低于买价，则卖
                        let { lastOrder } = this;
                        if (lastOrder && lastOrder.price > highPrice) {  // 购买价大于当前K线的最高价，则卖
                            // sell 待实现
                        }
                    }
                });
            });
        });
    }

    async doBuy(coinFrom, coinTo, type, other: { price, amount } = { price: 0, amount: 0}) {
        let userInfo = await this.getUserInfo();
        if (userInfo.result) {
            let { info: { funds } } = userInfo;
            let params: any = { symbol: `${coinFrom}_${coinTo}`, type };
            switch (type) {
                case 'buy_market':
                    params.price = funds.free[coinTo];
                    break;
                case 'sell_market':
                    params.amount = funds.free[coinFrom];
                    break;
                case 'buy':
                    params = { ...params, ...other };
                    break;
                case 'sell':
                    params = { ...params, ...other };
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
                    } else {
                        await wait(1000);
                    }
                } while(true);
                this.lastOrder = orderInfo.orders[0];
            }
            return rs.result;
        }
    }
}