export default class Manbi {
    private apiid;
    private secret;
    static baseUrl: string;
    static version: string;
    symbol: string;
    constructor(apiid: string, secret: string);
    buildSign(params: any): string;
    getBalance(): Promise<any>;
    geTicker(): Promise<any>;
    getOrderBook(): Promise<any>;
    buyAndSell(params: object): Promise<any>;
    getOrderInfo(orderid: string): Promise<any>;
    getCurrentOrders(params: {
        symbol: string;
    }): Promise<any>;
    cancelOrder(orderid: any): Promise<any>;
    getData(url: any, params?: any, method?: string): any;
}
