import Manbi from './manbi';
export default class ManbiStratege1 extends Manbi {
    buyNum: number;
    sellNum: number;
    disparityLimit: number;
    timelimit: number;
    taskInterval: number;
    static rate: number;
    static symbol: string;
    static symbolBuy: string;
    static symbolSell: string;
    taskId: any;
    constructor(apiid: any, secret: any, buyNum?: number, sellNum?: number, disparityLimit?: number, timelimit?: number, taskInterval?: number);
    run(): void;
    stop(): void;
    task(): Promise<void>;
    processOrders(ticker: object): Promise<any>;
}
