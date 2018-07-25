import MyReq from "../../request";
import Requester from "../../utils/declarations/requester";

export default class autoProxy implements Requester {
  static cursor = 0;
  static proxyList = [];
  requester = new MyReq();

}