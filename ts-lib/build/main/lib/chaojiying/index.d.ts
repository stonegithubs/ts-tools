import Req from '../request';
import Requester from '../utils/declarations/requester';
import CaptchaValidator from '../captchaValidators/captchaValidators.base';
export default class Chaojiying implements Requester, CaptchaValidator {
    protected user: string;
    protected pass: string;
    protected softid?: string;
    static readonly baseURL: string;
    requester: Req;
    constructor(user: string, pass: string, softid?: string);
    validate(userfile: any, codetype: string, softId?: string): any;
    getScore(): Promise<any>;
    reportError(id: any, softId?: any): Promise<any>;
}
