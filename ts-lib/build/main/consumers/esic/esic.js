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
        this.ajaxHeader = {
            'X-Requested-With': 'XMLHttpRequest'
        };
        this.headers = {
            Host: 'esic.vip',
            Origin: 'http://esic.vip',
            Referer: 'http://esic.vip/index/publics/pwdregister.html',
            'User-Agent': utils_1.randomUA()
        };
    }
    ;
    async getData(url, data, method = 'post', params = {}) {
        let { requester, headers } = this;
        params.headers = Object.assign({}, headers, params.headers);
        return requester.send(url, data, method, //xdl.wrapParams(
        params);
    }
    async getHTML(url = '/index/publics/pwdregister.html', params = {}) {
        let headers = {
            Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
            'Upgrade-Insecure-Requests': 1
        };
        params.headers = params.headers || {};
        params.headers = Object.assign({}, headers, params.headers);
        return this.getData(url, {}, 'get', Object.assign({ json: false }, params));
    }
    async getCaptcha() {
        let { ajaxHeader: headers } = this;
        return this.getData(`/index/publics/startcaptchaservlet.html?t=${Date.now()}`, {}, 'get', { headers });
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
        let { ajaxHeader: headers } = this;
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
                    let data = await this.getData('/index/code/getcode.html', form, 'post', { form, headers });
                    let { code, msg } = data;
                    if (code === 1 && msg === '验证码已发送') {
                        let { message = '' } = await dz.getMessageByMobile(form.mobile);
                        let code = message.match(/\d+/)[0];
                        return code ? { code, mobile } : utils_1.throwError('没有找到手机号');
                    }
                    else if (code === -1 && msg === '验证失败，请重新验证') {
                        // 验证失败过后没发短信，手机号还可以用
                        utils_1.log('验证失败!! 即将重新验证!', 'warn');
                        // return throwError('验证失败');
                    }
                    else {
                        utils_1.log('发送验证码失败, 错误:', data, 'warn');
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
        let { ajaxHeader: headers } = this;
        do {
            try {
                let result = await this.getData('/index/publics/verifymobile.html', { mobile }, 'get', { headers });
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
        let { ajaxHeader: headers } = this;
        do {
            let regResult = await this.getData('/index/publics/pwdregister.html', form, 'post', { form, headers });
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
        let { ajaxHeader: headers } = this;
        try {
            await this.getHTML('/index/publics/pwdlogin.html', { headers: {
                    Referer: 'http://esic.vip/index/publics/pwdlogin.html'
                } });
            let loginData = await this.getData('/index/publics/pwdlogin.html', form, 'post', { form, headers });
            if (loginData.code === 1 && loginData.msg === '登录成功') {
                utils_1.log('登录成功! 登陆信息为信息为：', loginData);
                this.redirect();
            }
        }
        catch (error) {
            utils_1.log('登录错误！', error, 'error');
        }
    }
    async redirect() {
        do {
            try {
                let redirectResult = await this.getHTML('', {});
                if (redirectResult && ~redirectResult.indexOf('<title>ESIC企服链</title>')) {
                    utils_1.log('注册完成, 重定向完成!');
                    break;
                }
            }
            catch (error) {
                utils_1.log('重定向错误!', error, 'error');
            }
        } while (await utils_1.wait(30000, true));
    }
    async task(tskId) {
        do {
            utils_1.log(`${tskId}开始!`);
            let { inviteCode: invite_code } = this;
            let codeAndMobile;
            try {
                let html = await this.getHTML();
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
                col.insertOne(Object.assign({}, regParams, { date: new Date().toLocaleString() }));
                await this.redirect();
                return utils_1.log(`${tskId}结束!`, 'warn');
            }
        } while (await utils_1.wait(2000, true));
    }
}
ESIC.baseUrl = 'http://esic.vip';
exports.default = ESIC;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXNpYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb25zdW1lcnMvZXNpYy9lc2ljLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxvQkFBb0I7Ozs7O0FBRXBCLDZEQUFxQztBQUNyQyx3RUFBZ0Q7QUFFaEQsMkRBQW1DO0FBQ25DLDJDQUE4RjtBQUU5RixvRkFBNEQ7QUFDNUQsMEZBQWtFO0FBRWxFLDBCQUEwQjtBQUUxQixNQUFNLEVBQUUsR0FBRyxJQUFJLFlBQUUsQ0FBQyxnQkFBZ0IsRUFBRSxjQUFjLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFFN0QsK0JBQStCO0FBRS9CLE1BQU0sRUFBRSxHQUFHLElBQUksaUJBQU8sQ0FBQyxRQUFRLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztBQUVwRCxnQ0FBZ0M7QUFFaEMsTUFBTSxHQUFHLEdBQUcsSUFBSSxrQkFBUSxDQUFDLEVBQUUsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sRUFBRSxrQ0FBa0MsRUFBRSxDQUFDLENBQUMsQ0FBQyx5Q0FBeUM7QUFFbkosK0JBQStCO0FBRS9CLE1BQU0sS0FBSyxHQUFHLElBQUksZUFBSyxFQUFFLENBQUM7QUFFMUIsTUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDO0FBRXBCO0lBR0UsWUFBbUIsVUFBVTtRQUFWLGVBQVUsR0FBVixVQUFVLENBQUE7UUFEN0IsY0FBUyxHQUFHLElBQUksbUJBQVMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEVBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV0RixlQUFVLEdBQUc7WUFDWCxrQkFBa0IsRUFBRSxnQkFBZ0I7U0FDckMsQ0FBQTtRQUNELFlBQU8sR0FBRztZQUNSLElBQUksRUFBRSxVQUFVO1lBQ2hCLE1BQU0sRUFBRSxpQkFBaUI7WUFDekIsT0FBTyxFQUFFLGdEQUFnRDtZQUN6RCxZQUFZLEVBQUUs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