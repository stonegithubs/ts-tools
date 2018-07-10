"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_1 = __importDefault(require("../../lib/request"));
const utils_1 = require("../../lib/utils");
const websocket_1 = __importDefault(require("../../lib/websocket"));
class Okex extends websocket_1.default {
    constructor(api_key, secret_key, wsOpts) {
        super(Okex.apiSocketUrl, wsOpts);
        this.api_key = api_key;
        this.secret_key = secret_key;
        this.fnQueue = {};
        this.wsPingPong();
    }
    ///////////////////////////////////////////// socket-begin /////////////////////////////////////////////
    _onmessage(msgEvent) {
        let data = JSON.parse(msgEvent.data) || [];
        let cb = this.fnQueue[data[0] && data[0].channel];
        if (cb) {
            cb(data);
        }
    }
    // https://github.com/okcoin-okex/API-docs-OKEx.com/blob/master/API-For-Spot-CN/%E5%B8%81%E5%B8%81%E4%BA%A4%E6%98%93WebSocket%20API.md#%E5%A6%82%E4%BD%95%E5%88%A4%E6%96%AD%E8%BF%9E%E6%8E%A5%E6%98%AF%E5%90%A6%E6%96%AD%E5%BC%80
    wsPingPong() {
        setInterval(() => {
            this.send({ event: 'ping' });
        }, 2000);
    }
    wsAddChanel(channel, parameters, fn, event = 'addChannel') {
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
    wsSubTicker(coinFrom, coinTo, cb) {
        this.wsAddChanel(`ok_sub_spot_${coinFrom}_${coinTo}_ticker`, cb);
    }
    // 2, ok_sub_spot_X_depth 订阅币币市场深度(200增量数据返回)
    wsSubBBDepth(coinFrom, coinTo, cb) {
        this.wsAddChanel(`ok_sub_spot_${coinFrom}_${coinTo}_depth`, cb);
    }
    // 3, ok_sub_spot_X_depth_Y 订阅市场深度, Y值为获取深度条数，如5，10，20
    wsSubDepth(coinFrom, coinTo, Y, cb) {
        this.wsAddChanel(`ok_sub_spot_${coinFrom}_${coinTo}_depth${Y ? '_' + Y : ''}`, cb);
    }
    // 4, ok_sub_spot_X_deals   订阅成交记录
    wsSubDeals(coinFrom, coinTo, cb) {
        this.wsAddChanel(`ok_sub_spot_${coinFrom}_${coinTo}_deals`, cb);
    }
    // 5, ok_sub_spot_X_kline_Y   订阅K线数据
    // Y值为K线时间周期，如1min, 3min, 5min, 15min, 30min, 1hour, 2hour, 4hour, 6hour, 12hour, day, 3day, week
    wsSubKLine(coinFrom, coinTo, Y, cb) {
        this.wsAddChanel(`ok_sub_spot_${coinFrom}_${coinTo}_kline${Y ? '_' + Y : ''}`, cb);
    }
    ///////// 币币交易 API /////////
    // 1, login 登录事件(个人信息推送)
    wsLogin() {
        let { api_key } = this;
        this.wsAddChanel('login', { api_key, sign: this._buildSign() }, (res = []) => {
            if (res[0] && res[0].data && res[0].data.result) {
                console.log('登录成功！');
            }
        }, 'login');
    }
    // 2, ok_sub_spot_X_order 交易数据
    wsSubOrder(coinFrom, coinTo, cb) {
        this.wsAddChanel(`ok_sub_spot_${coinFrom}_${coinTo}_order`, cb);
    }
    // 3, ok_sub_spot_X_balance 账户信息
    wsSubBalance(coinFrom, coinTo, cb) {
        this.wsAddChanel(`ok_sub_spot_${coinFrom}_${coinTo}_balance`, cb);
    }
    ///////////////////////////////////////////// socket-end /////////////////////////////////////////////
    ///////////////////////////////////////////// REST-begin /////////////////////////////////////////////
    getData(url, data = {}, method = 'get') {
        url = Okex.apiRestUrl + url;
        let { api_key } = this;
        switch (method.toLowerCase()) {
            case 'post':
                data = Object.assign({ api_key, sign: this._buildSign(data) }, data);
                break;
            case 'get':
            default:
                break;
        }
        return request_1.default.getJson(url, data, method);
    }
    getUserInfo() {
        return this.getData('userinfo.do', {}, 'post');
    }
    getOrderInfo(coinFrom, coinTo, order_id) {
        return this.getData('order_info.do', { symbol: `${coinFrom}_${coinTo}`, order_id }, 'post');
    }
    doTrade(params) {
        // 买卖类型：限价单(buy/sell) 市价单(buy_market/sell_market); 下单价格 市价卖单不传price; 交易数量 市价买单不传amount
        return this.getData('trade.do', params, 'post');
    }
    ///////////////////////////////////////////// REST-end /////////////////////////////////////////////
    _buildSign(params = {}) {
        let { api_key, secret_key } = this;
        params = Object.assign({}, params, { api_key });
        let sign = '';
        for (let key of utils_1.getSortedKeys(params)) {
            sign += `${key}=${params[key]}&`;
        }
        sign += `secret_key=${secret_key}`;
        return utils_1.md5(sign).toUpperCase();
    }
}
// static apiSocketUrl: string = 'wss://real.okex.com:10441/websocket';
Okex.apiSocketUrl = 'wss://okexcomreal.bafang.com:10441/websocket';
Okex.apiRestUrl = 'https://www.okex.com/api/v1/';
exports.default = Okex;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2tleC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb25zdW1lcnMvb2tleC9va2V4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsZ0VBQW9DO0FBQ3BDLDJDQUFxRDtBQUNyRCxvRUFBcUM7QUFFckMsVUFBMEIsU0FBUSxtQkFBRTtJQU1sQyxZQUNtQixPQUFlLEVBQ2YsVUFBa0IsRUFDbkMsTUFBWTtRQUVaLEtBQUssQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBSmhCLFlBQU8sR0FBUCxPQUFPLENBQVE7UUFDZixlQUFVLEdBQVYsVUFBVSxDQUFRO1FBSnJDLFlBQU8sR0FBVyxFQUFFLENBQUM7UUFRbkIsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQ3BCLENBQUM7SUFFRCx3R0FBd0c7SUFFeEcsVUFBVSxDQUFDLFFBQVE7UUFDakIsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQzNDLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNsRCxJQUFJLEVBQUUsRUFBRTtZQUNOLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUNWO0lBQ0gsQ0FBQztJQUVELGlPQUFpTztJQUNqTyxVQUFVO1FBQ1IsV0FBVyxDQUFDLEdBQUcsRUFBRTtZQUNmLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQztRQUMvQixDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDWCxDQUFDO0lBRUQsV0FBVyxDQUFFLE9BQWUsRUFBRSxVQUFnQixFQUFFLEVBQUcsRUFBRSxLQUFLLEdBQUcsWUFBWTtRQUN2RSxJQUFJLE9B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