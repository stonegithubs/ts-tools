import moment from 'moment';
import { wait } from '../../lib/utils';
import Okex from './okex';

const { abs } = Math;

export default class OkexStrategy extends Okex {
  kLine: any = {};
  lastOrder: any;
  constructor(apiKey, secretKey) {
    super(apiKey, secretKey);
  }

  task(coinFrom, coinTo, Y): void {
    // 3连涨或者连跌，如果没出现连跌但是已经比买的价格低了就卖
    let kLineName = coinFrom + coinTo + Y;
    let kLine = (this.kLine[kLineName] = []);
    this.wsSubKLine(coinFrom, coinTo, Y, data => {
      data.forEach(el => {
        el.data.forEach(item => {
          let [timestamp, openPrice, , , closePrice] = item;
          let diff = closePrice - openPrice;
          let time = moment(Number(timestamp)).format('YYYY-MM-DD HH:mm:ss');
          console.log(time + '\t' + diff + '\t' + (diff > 0 ? '涨' : '跌'));
          let kLineObj = kLine.find(tmp => tmp.timestamp === timestamp);
          if (kLineObj) {  // 每次 socket 推送更新 diff 数据
            kLineObj.diff = diff;
          } else {
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

          let result1 = this.strategy1(kLine, { time });  // 策略关卡 1
          let result2 = this.strategy2(item);  // 策略关卡 2
          let result3 = this.strategy3(item, 0.014);

          if (result1 > 0) {
            // buy
          } else if (result1 < 0 && result2 < 0 && result3 < 0) {
            // sell
          }

        });
      });
    });
  }

  // 返回值: 1 为 买, -1 为卖,  0 为忽略
  strategy1(kLine: any[], other?): (0 | 1 | -1 ) {
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
      } else if (k1.diff < 0 && k2.diff < 0 && k3.diff < 0) {
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
  strategy2(KLineObj: any[]): (0 | 1 | -1 ) {
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
  strategy3(KLineObj: any[], swingLimit): (0 | 1 | -1) {
    let [, openPrice, , , closePrice] = KLineObj;
    let diff = closePrice - openPrice;
    let swing = diff / closePrice;   // 实体大小
    if (abs(swing) > swingLimit) {  // 如果实体震动大小大于 swingLimit
      return diff > 0 ? 1 : -1;   // 涨买跌卖
    }
    return 0;
  }

  async doBuy( coinFrom, coinTo, type, other: { price; amount } = { price: 0, amount: 0 } ): Promise<any> {
    let userInfo = await this.getUserInfo();
    if (userInfo.result) {
      let {
        info: { funds }
      } = userInfo;
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
        } while (true);
        this.lastOrder = orderInfo.orders[0];
      }
      return rs.result;
    }
  }
}
