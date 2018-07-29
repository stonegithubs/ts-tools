"use strict";
// 2018年7月8日23:37:17
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongo_1 = __importDefault(require("../../lib/mongo/"));
const xundaili_1 = __importDefault(require("../../lib/proxy/xundaili"));
const dz_1 = __importDefault(require("../../lib/SMS/dz/"));
const utils_1 = require("../../lib/utils");
const autoProxy_1 = __importDefault(require("../../lib/proxy/autoProxy/autoProxy"));
const geetest_1 = __importDefault(require("../../lib/captchaValidators/geetest/geetest"));
//  --------- DZ ---------
const dz = new dz_1.default('zhang179817004', 'qq179817004*', '48108');
//  --------- Geetest ---------
const gt = new geetest_1.default('chosan', 'chosan179817004');
//  --------- XunDaili ---------
const xdl = new xundaili_1.default({ orderno: 'ZF20187249103GcJiAA', secret: 'f7691def90804df3ba830c1a1308a718' }); // ZF2018744533NVHTc0 ZF20187249103GcJiAA
//  --------- MongoDB ---------
const mongo = new mongo_1.default();
class ESIC {
    constructor(inviteCode) {
        this.inviteCode = inviteCode;
        this.requester = new autoProxy_1.default({ baseUrl: 'http://esic.vip', conf: { json: true } }, true);
    }
    ;
    async getData(url, data, method = 'post', params = {}) {
        let headers = {
            Host: 'esic.vip',
            'User-Agent': utils_1.randomUA()
        };
        params.headers = headers;
        let { requester } = this;
        return requester.send(url, data, method, //xdl.wrapParams(
        params);
        //);
    }
    async getHTML() {
        return this.getData('/index/publics/pwdregister.html', {}, 'get', { json: false });
    }
    async getCaptcha() {
        return this.getData(`/index/publics/startcaptchaservlet.html?t=${Date.now()}`);
    }
    async validate(captchaData = {}) {
        captchaData.referer = ESIC.baseUrl;
        return gt.validate(captchaData);
    }
    async getMobile() {
        return '17782369765';
    }
    async sendMsg(form) {
        let data = await this.getData('/index/code/getcode.html', form, 'post', { form, body: form });
        if (data.code === 1 && data.msg === '验证码已发送') {
            let sms_code = '';
            return sms_code;
        }
        else {
            return '';
        }
    }
    async register(form) {
        this.getData('/index/publics/pwdregister.html', form, 'post', { form, body: form });
    }
    async task() {
        let html = await this.getHTML();
        let captchaData = await this.getCaptcha();
        let validateResult = await this.validate(captchaData);
        let { inviteCode: invite_code } = this;
        let mobile = await this.getMobile();
        let { challenge: geetest_challenge, validate: geetest_validate } = validateResult;
        let geetest_seccode = geetest_validate + '|jordan';
        let sms_code = await this.sendMsg({ mobile, geetest_challenge, geetest_validate, geetest_seccode });
        let password = 'Chosan179817004'; // getRandomStr(15, 10);
        let regResult = await this.register({ mobile, sms_code, invite_code, password });
        utils_1.log(regResult);
    }
}
ESIC.baseUrl = 'http://esic.vip';
exports.default = ESIC;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXNpYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb25zdW1lcnMvZXNpYy9lc2ljLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxvQkFBb0I7Ozs7O0FBRXBCLDZEQUFxQztBQUNyQyx3RUFBZ0Q7QUFFaEQsMkRBQW1DO0FBQ25DLDJDQUE4RjtBQUU5RixvRkFBNEQ7QUFDNUQsMEZBQWtFO0FBRWxFLDBCQUEwQjtBQUUxQixNQUFNLEVBQUUsR0FBRyxJQUFJLFlBQUUsQ0FBQyxnQkFBZ0IsRUFBRSxjQUFjLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFFN0QsK0JBQStCO0FBRS9CLE1BQU0sRUFBRSxHQUFHLElBQUksaUJBQU8sQ0FBQyxRQUFRLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztBQUVwRCxnQ0FBZ0M7QUFFaEMsTUFBTSxHQUFHLEdBQUcsSUFBSSxrQkFBUSxDQUFDLEVBQUUsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sRUFBRSxrQ0FBa0MsRUFBRSxDQUFDLENBQUMsQ0FBQyx5Q0FBeUM7QUFFbkosK0JBQStCO0FBRS9CLE1BQU0sS0FBSyxHQUFHLElBQUksZUFBSyxFQUFFLENBQUM7QUFHMUI7SUFHRSxZQUFtQixVQUFVO1FBQVYsZUFBVSxHQUFWLFVBQVUsQ0FBQTtRQUQ3QixjQUFTLEdBQUcsSUFBSSxtQkFBUyxDQUFDLEVBQUUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLElBQUksRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsRUFBQyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3RELENBQUM7SUFBQSxDQUFDO0lBRWpDLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLElBQUssRUFBRSxNQUFNLEdBQUcsTUFBTSxFQUFFLFNBQWMsRUFBRTtRQUN6RCxJQUFJLE9BQU8sR0FBRztZQUNaLElBQUksRUFBRSxVQUFVO1lBQ2hCLFlBQVksRUFBRSxnQkFBUSxFQUFFO1NBQ3pCLENBQUE7UUFD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