import Okex from './okex';
export default class OkexStrategy extends Okex {
    kLine: any;
    lastOrder: any;
    constructor(apiKey: any, secretKey: any);
    task(coinFrom: any, coinTo: any, Y: any): void;
    strategy1(kLine: any[], other?: any): (0 | 1 | -1);
    strategy2(KLineObj: any[]): (0 | 1 | -1);
    strategy3(KLineObj: any[], swingLimit: any): (0 | 1 | -1);
    doBuy(coinFrom: any, coinTo: any, type: any, other?: {
        price: any;
        amount: any;
    }): Promise<any>;
}
