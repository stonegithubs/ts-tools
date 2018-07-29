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
const dz = new dz_1.default('zhang179817004', 'qq179817004*', '44887');
//  --------- Geetest ---------
const gt = new geetest_1.default('chosan', 'chosan179817004');
//  --------- XunDaili ---------
const xdl = new xundaili_1.default({ orderno: 'ZF20187249103GcJiAA', secret: 'f7691def90804df3ba830c1a1308a718' }); // ZF2018744533NVHTc0 ZF20187249103GcJiAA
//  --------- MongoDB ---------
const mongo = new mongo_1.default();
class ESIC {
    constructor(inviteCode) {
        this.inviteCode = inviteCode;
        this.requester = new autoProxy_1.default({ baseUrl: 'http://esic.vip', conf: { json: true } });
    }
    ;
    async getData(url, data, method = 'post', params = {}) {
        let headers = {
            Host: 'esic.vip',
            Origin: 'http://esic.vip',
            Referer: 'http://esic.vip/index/publics/pwdregister.html',
            'User-Agent': utils_1.randomUA(),
            'X-Requested-With': 'XMLHttpRequest'
        };
        params.headers = Object.assign({}, headers, params.headers);
        let { requester } = this;
        return requester.send(url, data, method, params);
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
        do {
            let [mobile] = await dz.getMobileNums();
            if (await this.verifyPhone(mobile)) {
                utils_1.log('手机号已经获取:\t', mobile);
                return mobile;
            }
            else {
                dz.addIgnoreList(mobile);
            }
        } while (await utils_1.wait(2000, true));
    }
    async sendMsg(form) {
        let mobile;
        do {
            let tskId;
            let captchaData = await this.getCaptcha();
            let validateResult = await this.validate(captchaData);
            if (validateResult.status === 'no') {
                continue;
            }
            let { challenge: geetest_challenge, validate: geetest_validate } = validateResult;
            let geetest_seccode = geetest_validate + '|jordan';
            mobile = mobile || await this.getMobile();
            form = { mobile, geetest_challenge, geetest_validate, geetest_seccode };
            try {
                let data = await this.getData('/index/code/getcode.html', form, 'post', { form });
                // 1 分钟发一次验证码
                tskId = setInterval(async () => data = await this.getData('/index/code/getcode.html', form, 'post', { form }).catch(e => utils_1.log(e, 'error')), 1000 * 70);
                let { code, msg } = data;
                if (code === 1 && msg === '验证码已发送') {
                    let { message = '' } = await dz.getMessageByMobile(form.mobile);
                    let code = message.match(/\d+/)[0];
                    return code ? { code, mobile } : utils_1.throwError('没有找到手机号');
                }
                else if (code === -1 && msg === '验证失败，请重新验证') {
                    return utils_1.throwError('验证失败');
                }
            }
            catch (error) {
                utils_1.log('发送验证码出错!', error, 'error');
            }
            finally {
                clearInterval(tskId);
            }
        } while (await utils_1.wait(2000, true));
        return '';
    }
    async verifyPhone(mobile) {
        do {
            try {
                let result = await this.getData('/index/publics/verifymobile.html', { mobile }, 'get');
                let { code, msg } = result;
                if (code === 1 && msg === '该手机号已注册请登录') {
                    return false;
                }
                else if (code === -1 && msg === '该手机号可以注册') {
                    return true;
                }
            }
            catch (error) {
                utils_1.log('验证手机号出错!', error, 'error');
            }
        } while (await utils_1.wait(2000, true));
        return false;
    }
    async register(form) {
        do {
            let regResult = await this.getData('/index/publics/pwdregister.html', form, 'post', { form });
            let { code, msg } = regResult;
            if (code === 1) {
                return true;
            }
            else if (code === -1 && msg === '短信验证码错误') {
                return utils_1.throwError(regResult);
            }
            else if (msg === '邀请人已被禁用') {
                let col = await mongo.getCollection('esic', 'running');
                col.updateOne({ code: form.invite_code }, { $inc: { count: 100000 } }, { upsert: true });
                return utils_1.throwError(regResult);
            }
        } while (await utils_1.wait(30000, true)); // 30 秒钟执行一次, 频率太快会被识别
        return false;
    }
    async task(tskId) {
        do {
            utils_1.log(`${tskId}开始!`);
            await this.getHTML();
            let { inviteCode: invite_code } = this;
            let codeAndMobile;
            try {
                codeAndMobile = await this.sendMsg();
            }
            catch (error) {
                utils_1.log('接收验证码错误!', error, 'error');
                this.requester = new autoProxy_1.default({ baseUrl: 'http://esic.vip', conf: { json: true } });
                continue;
            }
            let password = utils_1.getRandomStr(15, 12);
            let { code: sms_code, mobile } = codeAndMobile;
            let regParams = { mobile, sms_code, invite_code, password };
            let regResult;
            try {
                regResult = await this.register(regParams);
            }
            catch (error) {
                utils_1.log('注册错误', error, 'error');
                this.requester = new autoProxy_1.default({ baseUrl: 'http://esic.vip', conf: { json: true } });
                continue;
            }
            if (regResult) {
                let col = await mongo.getCollection('esic', 'regists');
                col.insertOne(regParams);
                utils_1.log(`${tskId}结束!`, 'warn');
                return;
            }
        } while (await utils_1.wait(2000, true));
    }
}
ESIC.baseUrl = 'http://esic.vip';
exports.default = ESIC;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXNpYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb25zdW1lcnMvZXNpYy9lc2ljLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxvQkFBb0I7Ozs7O0FBRXBCLDZEQUFxQztBQUNyQyx3RUFBZ0Q7QUFFaEQsMkRBQW1DO0FBQ25DLDJDQUE4RjtBQUU5RixvRkFBNEQ7QUFDNUQsMEZBQWtFO0FBRWxFLDBCQUEwQjtBQUUxQixNQUFNLEVBQUUsR0FBRyxJQUFJLFlBQUUsQ0FBQyxnQkFBZ0IsRUFBRSxjQUFjLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFFN0QsK0JBQStCO0FBRS9CLE1BQU0sRUFBRSxHQUFHLElBQUksaUJBQU8sQ0FBQyxRQUFRLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztBQUVwRCxnQ0FBZ0M7QUFFaEMsTUFBTSxHQUFHLEdBQUcsSUFBSSxrQkFBUSxDQUFDLEVBQUUsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sRUFBRSxrQ0FBa0MsRUFBRSxDQUFDLENBQUMsQ0FBQyx5Q0FBeUM7QUFFbkosK0JBQStCO0FBRS9CLE1BQU0sS0FBSyxHQUFHLElBQUksZUFBSyxFQUFFLENBQUM7QUFHMUI7SUFHRSxZQUFtQixVQUFVO1FBQVYsZUFBVSxHQUFWLFVBQVUsQ0FBQTtRQUQ3QixjQUFTLEdBQUcsSUFBSSxtQkFBUyxDQUFDLEVBQUUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLElBQUksRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsRUFBQyxDQUFDLENBQUM7SUFDaEQsQ0FBQztJQUFBLENBQUM7SUFFakMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsSUFBSyxFQUFFLE1BQU0sR0FBRyxNQUFNLEVBQUUsU0FBYyxFQUFFO1FBQ3pELElBQUksT0FBTyxHQUFHO1lBQ1osSUFBSSxFQUFFLFVBQVU7WUFDaEIsTUFBTSxFQUFFLGlCQUFpQjtZQUN6QixPQUFPLEVBQUUsZ0RBQWdEO1lBQ3pE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