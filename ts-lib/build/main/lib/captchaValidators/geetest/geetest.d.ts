import Requester from "../../utils/declarations/requester";
import CaptchaValidator from "../captchaValidators.base";
import MyReq from "../../request";
export default class Geetest implements Requester, CaptchaValidator {
    protected user: any;
    protected pass: any;
    requester: MyReq;
    getData(url: any, data?: any, method?: string, params?: any): Promise<any>;
    constructor(user: any, pass: any);
    validate(params: {
        gt?: any;
        challenge: any;
        referer: any;
        return?: any;
        model?: any;
    }): Promise<any>;
}
