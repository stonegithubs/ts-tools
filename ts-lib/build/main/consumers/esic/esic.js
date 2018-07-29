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
const debug = false;
class ESIC {
    constructor(inviteCode) {
        this.inviteCode = inviteCode;
        this.requester = new autoProxy_1.default({ baseUrl: 'http://esic.vip', conf: { json: true } }, debug);
        this.headers = {
            Host: 'esic.vip',
            Origin: 'http://esic.vip',
            Referer: 'http://esic.vip/index/publics/pwdregister.html',
            'User-Agent': utils_1.randomUA(),
            'X-Requested-With': 'XMLHttpRequest'
        };
    }
    ;
    async getData(url, data, method = 'post', params = {}) {
        let { requester, headers } = this;
        params.headers = Object.assign({}, headers, params.headers);
        return requester.send(url, data, method, //xdl.wrapParams(
        params);
    }
    async getHTML(url = '/index/publics/pwdregister.html', params) {
        params.headers = params.headers || {};
        params.headers['X-Requested-With'] = null;
        return this.getData(url, {}, 'get', Object.assign({ json: false }, params));
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
            utils_1.log(`获取手机号为：${mobile}`);
            if (await this.verifyPhone(mobile)) {
                utils_1.log('手机号已经获取:\t', mobile);
                return mobile;
            }
            else {
                dz.addIgnoreList(mobile);
            }
        } while (await utils_1.wait(2000, true));
    }
    async sendMsg() {
        let mobile;
        do {
            let captchaData = await this.getCaptcha();
            if (captchaData.gt && captchaData.challenge) {
                let validateResult = await this.validate(captchaData);
                if (validateResult.status === 'no') {
                    continue;
                }
                let { challenge: geetest_challenge, validate: geetest_validate } = validateResult;
                let geetest_seccode = geetest_validate + '|jordan';
                mobile = mobile || await this.getMobile();
                let form = { mobile, geetest_challenge, geetest_validate, geetest_seccode };
                try {
                    let data = await this.getData('/index/code/getcode.html', form, 'post', { form });
                    let { code, msg } = data;
                    if (code === 1 && msg === '验证码已发送') {
                        let { message = '' } = await dz.getMessageByMobile(form.mobile);
                        let code = message.match(/\d+/)[0];
                        return code ? { code, mobile } : utils_1.throwError('没有找到手机号');
                    }
                    else if (code === -1 && msg === '验证失败，请重新验证') {
                        // 验证失败过后没发短信，手机号还可以用
                        // return throwError('验证失败');
                    }
                    else {
                        mobile = null;
                    }
                }
                catch (error) {
                    utils_1.log('发送验证码出错!', error, 'error');
                }
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
    async login(form) {
        try {
            await this.getHTML('/index/publics/pwdlogin.html', { headers: {
                    Referer: 'http://esic.vip/index/publics/pwdlogin.html'
                } });
            let loginData = await this.getData('/index/publics/pwdlogin.html', form, 'post', { form });
            utils_1.log('登录信息为：', loginData);
        }
        catch (error) {
            utils_1.log('登录错误！', error, 'error');
        }
    }
    async task(tskId) {
        do {
            utils_1.log(`${tskId}开始!`);
            let { inviteCode: invite_code } = this;
            let codeAndMobile;
            try {
                await this.getHTML();
                codeAndMobile = await this.sendMsg();
            }
            catch (error) {
                utils_1.log('接收验证码错误!', error, 'error');
                this.requester = new autoProxy_1.default({ baseUrl: 'http://esic.vip', conf: { json: true } }, debug);
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
                this.requester = new autoProxy_1.default({ baseUrl: 'http://esic.vip', conf: { json: true } }, debug);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXNpYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb25zdW1lcnMvZXNpYy9lc2ljLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxvQkFBb0I7Ozs7O0FBRXBCLDZEQUFxQztBQUNyQyx3RUFBZ0Q7QUFFaEQsMkRBQW1DO0FBQ25DLDJDQUE4RjtBQUU5RixvRkFBNEQ7QUFDNUQsMEZBQWtFO0FBRWxFLDBCQUEwQjtBQUUxQixNQUFNLEVBQUUsR0FBRyxJQUFJLFlBQUUsQ0FBQyxnQkFBZ0IsRUFBRSxjQUFjLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFFN0QsK0JBQStCO0FBRS9CLE1BQU0sRUFBRSxHQUFHLElBQUksaUJBQU8sQ0FBQyxRQUFRLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztBQUVwRCxnQ0FBZ0M7QUFFaEMsTUFBTSxHQUFHLEdBQUcsSUFBSSxrQkFBUSxDQUFDLEVBQUUsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sRUFBRSxrQ0FBa0MsRUFBRSxDQUFDLENBQUMsQ0FBQyx5Q0FBeUM7QUFFbkosK0JBQStCO0FBRS9CLE1BQU0sS0FBSyxHQUFHLElBQUksZUFBSyxFQUFFLENBQUM7QUFFMUIsTUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDO0FBRXBCO0lBR0UsWUFBbUIsVUFBVTtRQUFWLGVBQVUsR0FBVixVQUFVLENBQUE7UUFEN0IsY0FBUyxHQUFHLElBQUksbUJBQVMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEVBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV0RixZQUFPLEdBQUc7WUFDUixJQUFJLEVBQUUsVUFBVTtZQUNoQixNQUFNLEVBQUUsaUJBQWlCO1lBQ3pCLE9BQU8sRUFBRSxnREFBZ0Q7WUFDekQsWUFBWSxFQUFFLGdCQUFRLEVBQUU7WUFDeEIsa0JBQWtCLEVBQUUsZ0JBQWdCO1NBQ3JDLENBQUE7SUFQ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