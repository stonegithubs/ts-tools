import Okex from './okex';
export default class OkexStratege extends Okex {
    kLine: any;
    lastOrder: any;
    constructor(apiKey: any, secretKey: any);
    task(coinFrom: any, coinTo: any, Y: any): void;
    doBuy(coinFrom: any, coinTo: any, type: any, other?: {
        price: any;
        amount: any;
    }): Promise<any>;
}
