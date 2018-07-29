import Requester from "../../utils/declarations/requester";
import CaptchaValidator from "../captchaValidators.base";
import MyReq from "../../request";


export default class Geetest implements Requester, CaptchaValidator{

  requester = new MyReq('http://jiyanapi.c2567.com', { json: true });

  getData(url, data?, method = 'get', params: any = {}) {
    let  { requester } = this;
    return requester.workFlow(url, data, method, params);
  }

  constructor(protected user, protected pass, ) {}
  validate(params: { gt?, challenge, referer, return?, model? }) {
      // http://jiyanapi.c2567.com/shibie?
      // gt=请输入gt参数&
      // challenge=请输入challenge参数
      // &referer=请输入来源地址参数&
      // user=test&
      // pass=test&
      // return=json&
      // model=3
    let { user, pass } = this;
    switch ((<any>params).success) {
      case 1:
        params.model = 3;
      break;
      case 0:
        params.model = 4;
      break;
      default:
        break;
    }
    return this.getData('/shibie', { user, pass, return: 'json', devuser: 'chosan', ...params });
  }
}