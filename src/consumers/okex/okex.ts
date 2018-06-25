import Req from '../../lib/request';
import { getSortedKeys, md5 } from '../../lib/utils';
import WS from '../../lib/websocket';

export default class Okex extends WS {
  // static apiSocketUrl: string = 'wss://real.okex.com:10441/websocket';
  static apiSocketUrl: string = 'wss://okexcomreal.bafang.com:10441/websocket';
  static apiRestUrl: string = 'https://www.okex.com/api/v1/';
  fnQueue: object = {};

  constructor(
    private readonly api_key: string,
    private readonly secret_key: string,
    wsOpts?: any
  ) {
    super(Okex.apiSocketUrl, wsOpts);
    this.wsPingPong();
  }

  ///////////////////////////////////////////// socket-begin /////////////////////////////////////////////

  _onmessage(msgEvent): void {
    let data = JSON.parse(msgEvent.data) || [];
    let cb = this.fnQueue[data[0] && data[0].channel];
    if (cb) {
      cb(data);
    }
  }

  // https://github.com/okcoin-okex/API-docs-OKEx.com/blob/master/API-For-Spot-CN/%E5%B8%81%E5%B8%81%E4%BA%A4%E6%98%93WebSocket%20API.md#%E5%A6%82%E4%BD%95%E5%88%A4%E6%96%AD%E8%BF%9E%E6%8E%A5%E6%98%AF%E5%90%A6%E6%96%AD%E5%BC%80
  wsPingPong(): void {
    setInterval(() => {
      this.send({ event: 'ping' });
    }, 2000);
  }

  wsAddChanel( channel: string, parameters?: any, fn?, event = 'addChannel' ): void {
    if (typeof parameters === 'function') {
      [fn, parameters] = [parameters, null];
    }
    this.send({
      event,
      channel,
      parameters
    });
    this.fnQueue[channel] = fn;
  }

  ///////// 币币行情 API /////////
  // 1, ok_sub_spot_X_ticker   订阅行情数据
  wsSubTicker(coinFrom, coinTo, cb?): void {
    this.wsAddChanel(`ok_sub_spot_${coinFrom}_${coinTo}_ticker`, cb);
  }
  // 2, ok_sub_spot_X_depth 订阅币币市场深度(200增量数据返回)
  wsSubBBDepth(coinFrom, coinTo, cb?): void {
    this.wsAddChanel(`ok_sub_spot_${coinFrom}_${coinTo}_depth`, cb);
  }
  // 3, ok_sub_spot_X_depth_Y 订阅市场深度, Y值为获取深度条数，如5，10，20
  wsSubDepth(coinFrom, coinTo, Y?, cb?): void {
    this.wsAddChanel(
      `ok_sub_spot_${coinFrom}_${coinTo}_depth${Y ? '_' + Y : ''}`,
      cb
    );
  }
  // 4, ok_sub_spot_X_deals   订阅成交记录
  wsSubDeals(coinFrom, coinTo, cb?): void {
    this.wsAddChanel(`ok_sub_spot_${coinFrom}_${coinTo}_deals`, cb);
  }

  // 5, ok_sub_spot_X_kline_Y   订阅K线数据
  // Y值为K线时间周期，如1min, 3min, 5min, 15min, 30min, 1hour, 2hour, 4hour, 6hour, 12hour, day, 3day, week
  wsSubKLine(coinFrom, coinTo, Y, cb?): void {
    this.wsAddChanel(
      `ok_sub_spot_${coinFrom}_${coinTo}_kline${Y ? '_' + Y : ''}`,
      cb
    );
  }

  ///////// 币币交易 API /////////
  // 1, login 登录事件(个人信息推送)
  wsLogin(): void {
    let { api_key } = this;
    this.wsAddChanel(
      'login',
      { api_key, sign: this._buildSign() },
      (res = []) => {
        if (res[0] && res[0].data && res[0].data.result) {
          console.log('登录成功！');
        }
      },
      'login'
    );
  }
  // 2, ok_sub_spot_X_order 交易数据
  wsSubOrder(coinFrom, coinTo, cb?): void {
    this.wsAddChanel(`ok_sub_spot_${coinFrom}_${coinTo}_order`, cb);
  }

  // 3, ok_sub_spot_X_balance 账户信息
  wsSubBalance(coinFrom, coinTo, cb?): void {
    this.wsAddChanel(`ok_sub_spot_${coinFrom}_${coinTo}_balance`, cb);
  }

  ///////////////////////////////////////////// socket-end /////////////////////////////////////////////

  ///////////////////////////////////////////// REST-begin /////////////////////////////////////////////

  getData(url: string, data: any = {}, method: string = 'get'): Promise<any> {
    url = Okex.apiRestUrl + url;
    let { api_key } = this;
    switch (method.toLowerCase()) {
      case 'post':
        data = { api_key, sign: this._buildSign(data), ...data };
        break;
      case 'get':
      default:
        break;
    }
    return Req.getJson(url, data, method);
  }

  getUserInfo(): Promise<any> {
    return this.getData('userinfo.do', {}, 'post');
  }

  getOrderInfo(coinFrom, coinTo, order_id): Promise<any> {
    return this.getData( 'order_info.do', { symbol: `${coinFrom}_${coinTo}`, order_id }, 'post' );
  }

  doTrade(params: {}): Promise<any> {
    // 买卖类型：限价单(buy/sell) 市价单(buy_market/sell_market); 下单价格 市价卖单不传price; 交易数量 市价买单不传amount
    return this.getData('trade.do', params, 'post');
  }

  ///////////////////////////////////////////// REST-end /////////////////////////////////////////////

  protected _buildSign(params: any = {}): string {
    let { api_key, secret_key } = this;
    params = { ...params, api_key };
    let sign = '';
    for (let key of getSortedKeys(params)) {
      sign += `${key}=${params[key]}&`;
    }
    sign += `secret_key=${secret_key}`;
    return md5(sign).toUpperCase();
  }
}
