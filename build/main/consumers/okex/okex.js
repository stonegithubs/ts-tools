"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_1 = __importDefault(require("../../lib/request"));
const websocket_1 = __importDefault(require("../../lib/websocket"));
const utils_1 = require("../../lib/utils");
class Okex extends websocket_1.default {
    constructor(api_key, secret_key, wsOpts) {
        super(Okex.apiSocketUrl, wsOpts);
        this.api_key = api_key;
        this.secret_key = secret_key;
        this.fnQueue = {};
        this.wsPingPong();
    }
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
    async getData(url, data = {}, method = 'get') {
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
        return await request_1.default.getJson(url, data, method);
    }
    getUserInfo() {
        return this.getData('userinfo.do', {}, 'post');
    }
    getOrderInfo(coinFrom, coinTo, order_id) {
        return this.getData('order_info.do', {
            symbol: `${coinFrom}_${coinTo}`,
            order_id
        }, 'post');
    }
    doTrade(params) {
        return this.getData('trade.do', params, 'post');
    }
}
Okex.apiSocketUrl = 'wss://real.okex.com:10441/websocketx';
Okex.apiRestUrl = 'https://www.okex.com/api/v1/';
exports.default = Okex;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2tleC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb25zdW1lcnMvb2tleC9va2V4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsZ0VBQW9DO0FBQ3BDLG9FQUFxQztBQUNyQywyQ0FBcUQ7QUFFckQsVUFBMEIsU0FBUSxtQkFBRTtJQUtsQyxZQUE2QixPQUFlLEVBQW1CLFVBQWtCLEVBQUUsTUFBWTtRQUM3RixLQUFLLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxNQUFNLENBQUMsQ0FBQztRQUROLFlBQU8sR0FBUCxPQUFPLENBQVE7UUFBbUIsZUFBVSxHQUFWLFVBQVUsQ0FBUTtRQUZqRixZQUFPLEdBQVcsRUFBRSxDQUFDO1FBSW5CLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztJQUNwQixDQUFDO0lBRVMsVUFBVSxDQUFDLFNBQWMsRUFBRTtRQUNuQyxJQUFJLEVBQUUsT0FBTyxFQUFFLFVBQVUsRUFBRSxHQUFHLElBQUksQ0FBQztRQUNuQyxNQUFNLHFCQUFRLE1BQU0sSUFBRSxPQUFPLEdBQUUsQ0FBQztRQUNoQyxJQUFJLElBQUksR0FBRyxFQUFFLENBQUM7UUFDZCxLQUFJLElBQUksR0FBRyxJQUFJLHFCQUFhLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDcEMsSUFBSSxJQUFJLEdBQUcsR0FBRyxJQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFBO1NBQ2pDO1FBQ0QsSUFBSSxJQUFJLGNBQWMsVUFBVSxFQUFFLENBQUM7UUFDbkMsT0FBTyxXQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDakMsQ0FBQztJQUVELHdHQUF3RztJQUV4RyxVQUFVLENBQUMsUUFBUTtRQUNqQixJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDM0MsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFD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