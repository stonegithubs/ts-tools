import SMSINTERFACE from './SMS.interface';
export default abstract class SMS implements SMSINTERFACE {
    static readonly baseURL: string;
    requester: any;
    abstract login(): any;
    abstract getUserInfos(): any;
    abstract getMessage(count: number, params?: any): any;
    abstract getMobileNums(params?: any): any;
    abstract getRecvingInfo(params?: any): any;
}
