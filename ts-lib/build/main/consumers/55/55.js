"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongo_1 = __importDefault(require("../../lib/mongo/"));
const xundaili_1 = __importDefault(require("../../lib/proxy/xundaili"));
const request_1 = __importDefault(require("../../lib/request"));
const dz_1 = __importDefault(require("../../lib/SMS/dz/"));
const utils_1 = require("../../lib/utils");
//  --------- DZ ---------
const dz = new dz_1.default('zhang179817004', 'qq179817004*', '48351');
//  --------- XunDaili ---------
const xdl = new xundaili_1.default({ orderno: 'ZF2018730302kdQRPU', secret: '944417ea359346e4ad882483cb63c13c' }); // ZF2018744533NVHTc0 ZF2018730302kdQRPU
//  --------- MongoDB ---------
const mongo = new mongo_1.default();
class Coin55 {
    constructor(inviteCode) {
        this.inviteCode = inviteCode;
        this.requester = new request_1.default('https://www.55.com', { json: true });
    }
    getData(path, data, method = 'post', params = {}) {
        let newPath = utils_1.buildURL(path, data);
        let { requester, inviteCode: code } = this;
        let headers = {
            token: params.token,
            'Content-Type': 'application/json;charset=UTF-8',
            Host: 'www.55.com',
            Origin: 'https://www.55.com',
            Pragma: 'no-cache',
            Referer: `https://www.55.com/login/sigin_up.html?code=${code}`,
            'X-Requested-With': 'XMLHttpRequest',
            'User-Agent': 'Mozilla/5.0 (Linux; U; Android 6.0.1; zh-CN; SM-C7000 Build/MMB29M) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/40.0.2214.89 UCBrowser/11.6.2.948 Mobile Safari/537.36' || utils_1.randomUA()
        };
        return requester.workFlow(newPath, data, method, xdl.wrapParams(Object.assign({}, params, { headers })));
    }
    async getHTML() {
        // 获取cookie
        let { requester, inviteCode: invite_code } = this;
        do {
            try {
                await requester.workFlow(`/invitation/signUpInvitation.html?invite_code=${invite_code}`, {}, 'get', { json: false });
                return;
            }
            catch (error) {
                utils_1.log('获取HTML出错！', error, 'error');
            }
        } while (await utils_1.wait(2000, true));
    }
    async sendCode(phone) {
        let result;
        do {
            try {
                result = await this.getData('/api/sso/user/send', { codeType: 'PHONE', itc: '86', operateType: 'REGISTER', phone });
                if (result.expiredSeconds)
                    return result;
                else if (result.code === 10001 && result.message === '该手机已被使用') {
                    return false;
                }
            }
            catch (error) {
                utils_1.log('发送手机验证码失败！', error, 'error');
            }
        } while (await utils_1.wait(2000, true));
    }
    async getPhone() {
        let phone;
        do {
            try {
                phone = await dz.getMobileNums();
            }
            catch (error) {
                utils_1.log('获取手机号错误!', error, 'error');
            }
        } while (!phone && (await utils_1.wait(2000, true)));
        return phone;
    }
    async getCode(phone) {
        let result;
        do {
            try {
                result = await dz.getMessageByMobile(phone);
            }
            catch (error) {
                utils_1.log('获取手机号错误!', error, 'error');
            }
        } while (!result && (await utils_1.wait(2000, true)));
        utils_1.log('dz验证信息：\t', result);
        return result.message.match(/您的验证码是：(\d+)，/)[1];
    }
    async checkCode(params) {
        let result;
        do {
            try {
                result = await this.getData('/api/sso/user/code_verify', Object.assign({ codeType: 'PHONE', operateType: 'REGISTER' }, params));
                if (result.token)
                    return result;
            }
            catch (error) {
                utils_1.log('发送手机验证码失败！', error, 'error');
            }
        } while (await utils_1.wait(2000, true));
    }
    async register(params, token) {
        let result;
        let { inviteCode } = this;
        do {
            try {
                result = await this.getData('/api/sso/user/register', Object.assign({ codeType: 'PHONE', inviteCode, itc: '86' }, params), 'post', { token });
                if (!result)
                    return !result;
            }
            catch (error) {
                utils_1.log('注册失败！', error, 'error');
            }
        } while (await utils_1.wait(2000, true));
        return '';
    }
    async login(phone, password) {
        await this.getData('/login/sigin.html', {}, 'get', { json: false });
        let result = await this.getData('/api/sso/user/login', { codeType: 'PHONE', phone, password });
    }
    async task(task_id) {
        do {
            let { inviteCode } = this;
            await this.getHTML();
            let [phone] = await this.getPhone();
            let sendCodeResult = await this.sendCode(phone);
            if (!sendCodeResult)
                continue; // 手机号被使用
            let phoneCode;
            try {
                phoneCode = await this.getCode(phone);
            }
            catch (error) {
                utils_1.log(error, 'error');
                continue;
            }
            let checkResult = await this.checkCode({ phoneCode, phone });
            utils_1.log('验证成功！', new Date(checkResult.expiredTime).toLocaleString());
            let password = utils_1.getRandomStr(14, 13) + utils_1.getRandomInt(100000);
            let { token } = checkResult;
            let regResult = await this.register({ phone, password }, token);
            if (regResult) {
                let col = await mongo.getCollection('55', 'regists');
                col.insertOne({ phone, password, inviteCode, phoneCode, task_id });
                console.log('注册完成！');
                this.login(phone, password);
                return utils_1.log(`${task_id}注册成功!`, 'warn');
            }
            utils_1.log('完成！', regResult);
        } while (await utils_1.wait(2000, true));
    }
}
exports.default = Coin55;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiNTUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29uc3VtZXJzLzU1LzU1LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQ0EsNkRBQXFDO0FBQ3JDLHdFQUFnRDtBQUNoRCxnRUFBc0M7QUFDdEMsMkRBQW1DO0FBQ25DLDJDQUF3RztBQUV4RywwQkFBMEI7QUFFMUIsTUFBTSxFQUFFLEdBQUcsSUFBSSxZQUFFLENBQUMsZ0JBQWdCLEVBQUUsY0FBYyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBRTdELGdDQUFnQztBQUVoQyxNQUFNLEdBQUcsR0FBRyxJQUFJLGtCQUFRLENBQUMsRUFBRSxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxFQUFFLGtDQUFrQyxFQUFFLENBQUMsQ0FBQyxDQUFDLHdDQUF3QztBQUVqSiwrQkFBK0I7QUFFL0IsTUFBTSxLQUFLLEdBQUcsSUFBSSxlQUFLLEVBQUUsQ0FBQztBQUUxQjtJQUVFLFlBQXNCLFVBQVU7UUFBVixlQUFVLEdBQVYsVUFBVSxDQUFBO1FBRGhDLGNBQVMsR0FBRyxJQUFJLGlCQUFLLENBQUMsb0JBQW9CLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUN6QixDQUFDO0lBQ3BDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLE1BQU0sR0FBRyxNQUFNLEVBQUUsTUFBTSxHQUFHLEVBQVM7UUFDckQsSUFBSSxPQUFPLEdBQUcsZ0JBQVEsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDbkMsSUFBSSxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDO1FBQzNDLElBQUksT0FBTyxHQUFHO1lBQ1osS0FBSyxFQUFFLE1BQU0sQ0FBQyxLQUFLO1lBQ25CLGNBQWMsRUFBRSxnQ0FBZ0M7WUFDaEQsSUFBSSxFQUFFLFlBQVk7WUFDbEIsTUFBTSxFQUFFLG9CQUFvQjtZQUM1QixNQUFN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