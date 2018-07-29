import Requester from '../../../lib/utils/declarations/requester';

export default interface SMS extends Requester{
  login(): boolean;
  getUserInfo(): any;
  // _getMessage(mobile: string): any;
  getMessage(count: number): any;
  getMobileNums(): any;
  getRecvingInfo(): any;
}