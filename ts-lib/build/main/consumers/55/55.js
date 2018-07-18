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
const xdl = new xundaili_1.default({
    orderno: 'ZF2018730302kdQRPU',
    secret: '944417ea359346e4ad882483cb63c13c'
}); // ZF2018744533NVHTc0 ZF2018730302kdQRPU
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
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1'
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
        console.log(result);
    }
    async task() {
        do {
            let { inviteCode } = this;
            await this.getHTML();
            let [phone] = await this.getPhone();
            let sendCodeResult = await this.sendCode(phone);
            if (!sendCodeResult)
                continue; // 手机号被使用
            let phoneCode = await this.getCode(phone);
            let checkResult = await this.checkCode({ phoneCode, phone });
            utils_1.log('验证成功！', new Date(checkResult.expiredTime).toLocaleString());
            let password = utils_1.getRandomStr(14, 13) + utils_1.getRandomInt(100000);
            let { token } = checkResult;
            let regResult = await this.register({ phone, password }, token);
            if (regResult) {
                let col = await mongo.getCollection('55', 'regists');
                col.insertOne({ phone, password, inviteCode, phoneCode });
                console.log('注册完成！');
                this.login(phone, password);
                return;
            }
            utils_1.log('完成！', regResult);
        } while (await utils_1.wait(2000, true));
    }
}
exports.default = Coin55;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiNTUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29uc3VtZXJzLzU1LzU1LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQ0EsNkRBQXFDO0FBQ3JDLHdFQUFnRDtBQUNoRCxnRUFBc0M7QUFDdEMsMkRBQW1DO0FBQ25DLDJDQU95QjtBQUd6QiwwQkFBMEI7QUFFMUIsTUFBTSxFQUFFLEdBQUcsSUFBSSxZQUFFLENBQUMsZ0JBQWdCLEVBQUUsY0FBYyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBRTdELGdDQUFnQztBQUVoQyxNQUFNLEdBQUcsR0FBRyxJQUFJLGtCQUFRLENBQUM7SUFDdkIsT0FBTyxFQUFFLG9CQUFvQjtJQUM3QixNQUFNLEVBQUUsa0NBQWtDO0NBQzNDLENBQUMsQ0FBQyxDQUFDLHdDQUF3QztBQUU1QywrQkFBK0I7QUFFL0IsTUFBTSxLQUFLLEdBQUcsSUFBSSxlQUFLLEVBQUUsQ0FBQztBQUUxQjtJQUVFLFlBQXNCLFVBQVU7UUFBVixlQUFVLEdBQVYsVUFBVSxDQUFBO1FBRGhDLGNBQVMsR0FBRyxJQUFJLGlCQUFLLENBQUMsb0JBQW9CLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUN6QixDQUFDO0lBQ3BDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLE1BQU0sR0FBRyxNQUFNLEVBQUUsTUFBTSxHQUFHLEVBQVM7UUFDckQsSUFBSSxPQUFPLEdBQUcsZ0JBQVEsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDbkMsSUFBSSxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDO1FBQzNDLElBQUksT0FBTyxHQUFHO1lBQ1osS0FBSyxFQUFFLE1BQU0sQ0FBQyxLQUFLO1lBQ25CLGNBQWMsRUFBRSxnQ0FBZ0M7WUFDaEQsSUFBSSxFQUFFLFlBQVk7WUFDbEIsTUFBTSxFQUFFLG9CQUFvQjtZQUM1QixN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