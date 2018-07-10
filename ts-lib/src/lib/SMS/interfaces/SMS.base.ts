
import SMSINTERFACE from './SMS.interface';

export default abstract class SMS implements SMSINTERFACE {
  static readonly baseURL: string;    // typescript 不会检查静态端, 因此实现可能会被忽略
  requester: any;
  abstract login(): any;
  abstract getUserInfos(): any;
  // abstract _getMessage(mobile: string): any;
  abstract getMessage(count: number, params?: any): any;
  abstract getMobileNums(params?: any): any;
  abstract getRecvingInfo(params?: any): any;
}