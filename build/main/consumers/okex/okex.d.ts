import WS from '../../lib/websocket';
export default class Okex extends WS {
    private readonly api_key;
    private readonly secret_key;
    static apiSocketUrl: string;
    static apiRestUrl: string;
    fnQueue: object;
    constructor(api_key: string, secret_key: string, wsOpts?: any);
    protected _buildSign(params?: any): string;
    _onmessage(msgEvent: any): void;
    wsPingPong(): void;
    wsAddChanel(channel: string, parameters?: any, fn?: any, event?: string): void;
    wsSubTicker(coinFrom: any, coinTo: any, cb?: any): void;
    wsSubBBDepth(coinFrom: any, coinTo: any, cb?: any): void;
    wsSubDepth(coinFrom: any, coinTo: any, Y?: any, cb?: any): void;
    wsSubDeals(coinFrom: any, coinTo: any, cb?: any): void;
    wsSubKLine(coinFrom: any, coinTo: any, Y: any, cb?: any): void;
    wsLogin(): void;
    wsSubOrder(coinFrom: any, coinTo: any, cb?: any): void;
    wsSubBalance(coinFrom: any, coinTo: any, cb?: any): void;
    getData(url: string, data?: any, method?: string): Promise<any>;
    getUserInfo(): Promise<any>;
    getOrderInfo(coinFrom: any, coinTo: any, order_id: any): Promise<any>;
    doTrade(params: {}): Promise<any>;
}
