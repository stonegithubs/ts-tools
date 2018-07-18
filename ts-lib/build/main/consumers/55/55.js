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
        console.log(result);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiNTUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29uc3VtZXJzLzU1LzU1LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQ0EsNkRBQXFDO0FBQ3JDLHdFQUFnRDtBQUNoRCxnRUFBc0M7QUFDdEMsMkRBQW1DO0FBQ25DLDJDQUE4RjtBQUU5RiwwQkFBMEI7QUFFMUIsTUFBTSxFQUFFLEdBQUcsSUFBSSxZQUFFLENBQUMsZ0JBQWdCLEVBQUUsY0FBYyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBRTdELGdDQUFnQztBQUVoQyxNQUFNLEdBQUcsR0FBRyxJQUFJLGtCQUFRLENBQUMsRUFBRSxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxFQUFFLGtDQUFrQyxFQUFFLENBQUMsQ0FBQyxDQUFDLHdDQUF3QztBQUVqSiwrQkFBK0I7QUFFL0IsTUFBTSxLQUFLLEdBQUcsSUFBSSxlQUFLLEVBQUUsQ0FBQztBQUUxQjtJQUVFLFlBQXNCLFVBQVU7UUFBVixlQUFVLEdBQVYsVUFBVSxDQUFBO1FBRGhDLGNBQVMsR0FBRyxJQUFJLGlCQUFLLENBQUMsb0JBQW9CLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUN6QixDQUFDO0lBQ3BDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLE1BQU0sR0FBRyxNQUFNLEVBQUUsTUFBTSxHQUFHLEVBQVM7UUFDckQsSUFBSSxPQUFPLEdBQUcsZ0JBQVEsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDbkMsSUFBSSxFQUFFLFNBQVMsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDO1FBQzNDLElBQUksT0FBTyxHQUFHO1lBQ1osS0FBSyxFQUFFLE1BQU0sQ0FBQyxLQUFLO1lBQ25CLGNBQWMsRUFBRSxnQ0FBZ0M7WUFDaEQsSUFBSSxFQUFFLFlBQVk7WUFDbEIsTUFBTSxFQUFFLG9CQUFvQjtZQUM1QixNQUFNLEVBQUUsVUFBVTtZQUNsQixPQUFPLEVBQUUsK0NBQStDLElBQUksRUFBRTtZQUM5RCxrQkFBa0IsRUFBRSxnQkFBZ0I7WUFDcEMsWUFBWSxFQUFFLHlJQUF5STtTQUN4SixDQUFDO1FBQ0YsT0FBTyxTQUFTLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEdBQUcsQ0FBQyxVQUFVLG1CQUFNLE1BQU0sSUFBRSxPQUFPLElBQUcsQ0FBQyxDQUFDO0lBQzNGLENBQUM7SUFDRCxLQUFLLENBQUMsT0FBTztRQUNYLFdBQVc7UUFDWCxJQUFJLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUUsR0FBRyxJQUFJLENBQUM7UUFDbEQsR0FBRztZQUNELElBQUk7Z0JBQ0YsTUFBTSxTQUFTLENBQUMsUUFBUSxDQUFFLGlEQUFpRCxXQUFXLEVBQUUsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxDQUFFLENBQUM7Z0JBQ3ZILE9BQU87YUFDUjtZQUFDLE9BQU8sS0FBSyxFQUFFO2dCQUNkLFdBQUcsQ0FBQyxXQUFXLEVBQUUsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO2FBQ2xDO1NBQ0YsUUFBUSxNQUFNLFlBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEVBQUU7SUFDbkMsQ0FBQztJQUNELEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSztRQUNsQixJQUFJLE1BQU0sQ0FBQztRQUNYLEdBQUc7WUFDRCxJQUFJO2dCQUNGLE1BQU0sR0FBRyxNQUFNLElBQUksQ0FBQyxPQUFPLENBQUMsb0JBQW9CLEVBQUUsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO2dCQUNwSCxJQUFJLE1BQU0sQ0FBQyxjQUFjO29CQUFFLE9BQU8sTUFBTSxDQUFDO3FCQUNwQyxJQUFJLE1BQU0sQ0FBQyxJQUFJLEtBQUssS0FBSyxJQUFJLE1BQU0sQ0FBQyxPQUFPLEtBQUssU0FBUyxFQUFFO29CQUM5RCxPQUFPLEtBQUssQ0FBQztpQkFDZDthQUNGO1lBQUMsT0FBTyxLQUFLLEVBQUU7Z0JBQ2QsV0FBRyxDQUFDLFlBQVksRUFBRSxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7YUFDbkM7U0FDRixRQUFRLE1BQU0sWUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsRUFBRTtJQUNuQyxDQUFDO0lBQ0QsS0FBSyxDQUFDLFFBQVE7UUFDWixJQUFJLEtBQUssQ0FBQztRQUNWLEdBQUc7WUFDRCxJQUFJO2dCQUNGLEtBQUssR0FBRyxNQUFNLEVBQUUsQ0FBQyxhQUFhLEVBQUUsQ0FBQzthQUNsQztZQUFDLE9BQU8sS0FBSyxFQUFFO2dCQUNkLFdBQUcsQ0FBQyxVQUFVLEVBQUUsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO2FBQ2pDO1NBQ0YsUUFBUSxDQUFDLEtBQUssSUFBSSxDQUFDLE1BQU0sWUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFO1FBQzdDLE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQztJQUNELEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSztRQUNqQixJQUFJLE1BQU0sQ0FBQztRQUNYLEdBQUc7WUFDRCxJQUFJO2dCQUNGLE1BQU0sR0FBRyxNQUFNLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUM3QztZQUFDLE9BQU8sS0FBSyxFQUFFO2dCQUNkLFdBQUcsQ0FBQyxVQUFVLEVBQUUsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO2FBQ2pDO1NBQ0YsUUFBUSxDQUFDLE1BQU0sSUFBSSxDQUFDLE1BQU0sWUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxFQUFFO1FBQzlDLFdBQUcsQ0FBQyxXQUFXLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDekIsT0FBTyxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBQ0QsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNO1FBQ3BCLElBQUksTUFBTSxDQUFDO1FBQ1gsR0FBRztZQUNELElBQUk7Z0JBQ0YsTUFBTSxHQUFHLE1BQU0sSUFBSSxDQUFDLE9BQU8sQ0FBQywyQkFBMkIsa0JBQUksUUFBUSxFQUFFLE9BQU8sRUFBRSxXQUFXLEVBQUUsVUFBVSxJQUFLLE1BQU0sRUFBRyxDQUFDO2dCQUNwSCxJQUFJLE1BQU0sQ0FBQyxLQUFLO29CQUFFLE9BQU8sTUFBTSxDQUFDO2FBQ2pDO1lBQUMsT0FBTyxLQUFLLEVBQUU7Z0JBQ2QsV0FBRyxDQUFDLFlBQVksRUFBRSxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7YUFDbkM7U0FDRixRQUFRLE1BQU0sWUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsRUFBRTtJQUNuQyxDQUFDO0lBQ0QsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsS0FBSztRQUMxQixJQUFJLE1BQU0sQ0FBQztRQUNYLElBQUksRUFBRSxVQUFVLEVBQUUsR0FBRyxJQUFJLENBQUM7UUFDMUIsR0FBRztZQUNELElBQUk7Z0JBQ0YsTUFBTSxHQUFHLE1BQU0sSUFBSSxDQUFDLE9BQU8sQ0FBRSx3QkFBd0Isa0JBQUksUUFBUSxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsR0FBRyxFQUFFLElBQUksSUFBSyxNQUFNLEdBQUksTUFBTSxFQUFFLEVBQUUsS0FBSyxFQUFFLENBQUUsQ0FBQztnQkFDcEksSUFBSSxDQUFDLE1BQU07b0JBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQzthQUM3QjtZQUFDLE9BQU8sS0FBSyxFQUFFO2dCQUNkLFdBQUcsQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO2FBQzlCO1NBQ0YsUUFBUSxNQUFNLFlBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEVBQUU7UUFDakMsT0FBTyxFQUFFLENBQUM7SUFDWixDQUFDO0lBQ0QsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsUUFBUTtRQUN6QixNQUFNLElBQUksQ0FBQyxPQUFPLENBQUMsbUJBQW1CLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBQ3BFLElBQUksTUFBTSxHQUFHLE1BQU0sSUFBSSxDQUFDLE9BQU8sQ0FBQyxxQkFBcUIsRUFBRSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUM7UUFDL0YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN0QixDQUFDO0lBQ0QsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPO1FBQ2hCLEdBQUc7WUFDRCxJQUFJLEVBQUUsVUFBVSxFQUFFLEdBQUcsSUFBSSxDQUFDO1lBQzFCLE1BQU0sSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ3JCLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxNQUFNLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUNwQyxJQUFJLGNBQWMsR0FBRyxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDaEQsSUFBSSxDQUFDLGNBQWM7Z0JBQUUsU0FBUyxDQUFDLFNBQVM7WUFDeEMsSUFBSSxTQUFTLENBQUM7WUFDZCxJQUFJO2dCQUNGLFNBQVMsR0FBRyxNQUFNLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDdkM7WUFBQyxPQUFPLEtBQUssRUFBRTtnQkFDZCxXQUFHLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO2dCQUNwQixTQUFTO2FBQ1Y7WUFDRCxJQUFJLFdBQVcsR0FBRyxNQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztZQUM3RCxXQUFHLENBQUMsT0FBTyxFQUFFLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDO1lBQ2pFLElBQUksUUFBUSxHQUFHLG9CQUFZLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxHQUFHLG9CQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDM0QsSUFBSSxFQUFFLEtBQUssRUFBRSxHQUFHLFdBQVcsQ0FBQztZQUM1QixJQUFJLFNBQVMsR0FBRyxNQUFNLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDaEUsSUFBSSxTQUFTLEVBQUU7Z0JBQ2IsSUFBSSxHQUFHLEdBQUcsTUFBTSxLQUFLLENBQUMsYUFBYSxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztnQkFDckQsR0FBRyxDQUFDLFNBQVMsQ0FBQyxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDO2dCQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQ3pGLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO2dCQUM1QixPQUFPLFdBQUcsQ0FBQyxHQUFHLE9BQU8sT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO2FBQ3ZDO1lBQ0QsV0FBRyxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsQ0FBQztTQUN2QixRQUFRLE1BQU0sWUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsRUFBRTtJQUNuQyxDQUFDO0NBQ0Y7QUE1SEQseUJBNEhDIn0=