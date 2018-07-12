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
            'Host': 'www.55.com',
            'Origin': 'https://www.55.com',
            'Pragma': 'no-cache',
            'Referer': `https://www.55.com/login/sigin_up.html?code=${code}`,
            'X-Requested-With': 'XMLHttpRequest',
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1'
        };
        return requester.workFlow(newPath, data, method, xdl.wrapParams(Object.assign({}, params, { headers })));
    }
    async getHTML() {
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
                result = await this.getData('/api/sso/user/send', {
                    codeType: "PHONE",
                    itc: "86",
                    operateType: "REGISTER",
                    phone
                });
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
        } while (!phone && await utils_1.wait(2000, true));
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
        } while (!result && await utils_1.wait(2000, true));
        return result.message.match(/您的验证码是：(\d+)，/)[1];
    }
    async checkCode(params) {
        let result;
        do {
            try {
                result = await this.getData('/api/sso/user/code_verify', Object.assign({ codeType: "PHONE", operateType: "REGISTER" }, params));
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
                result = await this.getData('/api/sso/user/register', Object.assign({ codeType: "PHONE", inviteCode, itc: "86" }, params), 'post', { token });
                if (!result)
                    return !result;
            }
            catch (error) {
                utils_1.log('注册失败！', error, 'error');
            }
        } while (await utils_1.wait(2000, true));
    }
    async login(phone, password) {
        await this.getData('/login/sigin.html', {}, 'get', { json: false });
        let result = await this.getData('/api/sso/user/login', {
            codeType: "PHONE",
            phone,
            password
        });
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
                col.insertOne({
                    phone, password, inviteCode, phoneCode
                });
                console.log('注册完成！');
                this.login(phone, password);
                return;
            }
            utils_1.log('完成！', regResult);
        } while (await utils_1.wait(2000, true));
    }
}
exports.default = Coin55;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiNTUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29uc3VtZXJzLzU1LzU1LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQ0EsNkRBQXFDO0FBQ3JDLHdFQUFnRDtBQUNoRCxnRUFBc0M7QUFDdEMsMkRBQW1DO0FBQ25DLDJDQUE4RjtBQUc5RiwwQkFBMEI7QUFFMUIsTUFBTSxFQUFFLEdBQUcsSUFBSSxZQUFFLENBQUMsZ0JBQWdCLEVBQUUsY0FBYyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBRTdELGdDQUFnQztBQUVoQyxNQUFNLEdBQUcsR0FBRyxJQUFJLGtCQUFRLENBQUMsRUFBRSxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxFQUFFLGtDQUFrQyxFQUFFLENBQUMsQ0FBQyxDQUFDLHdDQUF3QztBQUVqSiwrQkFBK0I7QUFFL0IsTUFBTSxLQUFLLEdBQUcsSUFBSSxlQUFLLEVBQUUsQ0FBQztBQUcxQjtJQUVJLFlBQXNCLFVBQVU7UUFBVixlQUFVLEdBQVYsVUFBVSxDQUFBO1FBRGhDLGNBQVMsR0FBRyxJQUFJLGlCQUFLLENBQUMsb0JBQW9CLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUN4QixDQUFDO0lBQ3JDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLE1BQU0sR0FBRyxNQUFNLEVBQUUsTUFBTSxHQUFHLEVBQVM7UUFDbkQsSUFBSSxPQUFPLEdBQUcsZ0JBQVEsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDbkMsSUFBSSxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDO1FBQzNDLElBQUksT0FBTyxHQUFHO1lBQ1YsS0FBSyxFQUFFLE1BQU0sQ0FBQyxLQUFLO1lBQ25CLGNBQWMsRUFBRSxnQ0FBZ0M7WUFDaEQsTUFBTSxFQUFFLFlBQVk7WUFDcEIsUUFBUSxFQUFFLG9CQUFvQjtZQUM5QixRQUFR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