"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = __importDefault(require("ioredis"));
const request_1 = __importDefault(require("request"));
const chaojiying_1 = __importDefault(require("../../lib/chaojiying"));
const utils_1 = require("../../lib/mail/utils");
// import Req from '../../lib/request';
let redis = new ioredis_1.default({
    host: 'chosan.cn',
    password: '199381'
});
redis.subscribe('mailReceived', (err, count) => {
    if (err) {
        throw new Error(err.message);
    }
    else {
        console.log(`当前第 ${count} 位订阅 mailReceived 的用户`);
    }
});
class Epnex {
    constructor(invitation, proxy = 'http://chosan.cn:12345') {
        this.invitation = invitation;
        this.proxy = proxy;
    }
    getData(uri, form = {}) {
        let { baseUrl, commonHeader: headers } = Epnex;
        let { proxy, jar } = this;
        let url = baseUrl + uri;
        return new Promise((res, rej) => {
            request_1.default.post(url, { form, headers, proxy, jar }, (err, resp, body) => {
                if (err || resp.statusCode !== 200) {
                    rej(err || resp.statusMessage);
                }
                else {
                    res(typeof body === 'string' ? JSON.parse(body) : body);
                }
            });
        });
        // .then(data => {
        //   return typeof data === 'string' ? JSON.parse(data) : data;
        // });
    }
    async register(form) {
        if (form) {
            let { invitation } = this;
            let user_password = 'Epnexio123';
            let result = await this.getData('/Registered', JSON.stringify(Object.assign({}, form, { invitation, user_password })));
            if (result.errcode === 0 && result.result === 200) {
                return result;
            }
            else {
                throw new Error(`注册错误！错误消息:\t${JSON.stringify(result)}`);
            }
        }
        else {
            throw new Error('注册必要参数缺失！');
        }
    }
    async getEmailValidCode(PvilidCode) {
        if (!PvilidCode)
            throw new Error('获取邮件验证码函数必要参数缺失！');
        let user_email = utils_1.gMail();
        let sendResult = await this.getData('/emailValidCode', JSON.stringify({ user_email, PvilidCode }));
        return new Promise((res, rej) => {
            if (sendResult.errcode === 0 && sendResult.result === 200) {
                redis.on('message', (channel, message) => {
                    if (channel === 'mailReceived') {
                        let msg = JSON.parse(message);
                        if (msg && msg.to.value[0].address === user_email) {
                            let validCode = msg.html.match(/{EPNEX.IO} (\d+) is your verification code/)[1];
                            res({ validCode, user_email });
                        }
                    }
                });
            }
            else {
                rej(`邮箱验证码发送失败!错误消息:\t${JSON.stringify(sendResult)}`);
            }
        });
    }
    async getPvilidCode() {
        let { baseUrl, commonHeader: headers } = Epnex;
        let { proxy } = this;
        let jar = this.jar = request_1.default.jar();
        let cjy = new chaojiying_1.default('179817004', 'Mailofchaojiying*');
        let pic = request_1.default(baseUrl + '/userValidateCode', { jar, proxy, headers });
        let codeObj = await cjy.validate(pic, '1005', '896776');
        if (codeObj && codeObj.err_no === 0 && codeObj.err_str === 'OK') {
            return codeObj.pic_str;
        }
        else {
            throw new Error(codeObj && codeObj.err_str || '识别图片验证码错误!');
        }
    }
    async task() {
        try {
            let pvCode = await this.getPvilidCode();
            let emailAndCode = await this.getEmailValidCode(pvCode);
            let regResult = await this.register(emailAndCode);
            if (regResult.errcode === 0 && regResult.result === 200) {
                // 注册成功，进行手机验证。
            }
        }
        catch (error) {
            console.error(error);
        }
    }
}
Epnex.baseUrl = 'https://epnex.io/api';
Epnex.commonHeader = {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    Host: 'epnex.io',
    Origin: 'https://epnex.io',
    Referer: 'https://epnex.io/phoneSelf_sign.html?i=00VHmxY&lan=0',
    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1'
};
exports.default = Epnex;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXBuZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29uc3VtZXJzL2VwbmV4L2VwbmV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsc0RBQTRCO0FBQzVCLHNEQUF5QjtBQUN6QixzRUFBOEM7QUFDOUMsZ0RBQTZDO0FBQzdDLHVDQUF1QztBQUV2QyxJQUFJLEtBQUssR0FBRyxJQUFJLGlCQUFLLENBQUM7SUFDcEIsSUFBSSxFQUFFLFdBQVc7SUFDakIsUUFBUSxFQUFFLFFBQVE7Q0FDbkIsQ0FBQyxDQUFDO0FBRUgsS0FBSyxDQUFDLFNBQVMsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLEVBQUU7SUFDN0MsSUFBSSxHQUFHLEVBQUU7UUFDUCxNQUFNLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztLQUM5QjtTQUFNO1FBQ0wsT0FBTyxDQUFDLEdBQUcsQ0FBQyxPQUFPLEtBQUssdUJBQXVCLENBQUMsQ0FBQztLQUNsRDtBQUNILENBQUMsQ0FBQyxDQUFDO0FBRUg7SUFVRSxZQUFtQixVQUFrQixFQUFTLFFBQWdCLHdCQUF3QjtRQUFuRSxlQUFVLEdBQVYsVUFBVSxDQUFRO1FBQVMsVUFBSyxHQUFMLEtBQUssQ0FBbUM7SUFBRyxDQUFDO0lBRTFGLE9BQU8sQ0FBQyxHQUFXLEVBQUUsT0FBWSxFQUFFO1FBQ2pDLElBQUksRUFBRSxPQUFPLEVBQUUsWUFBWSxFQUFFLE9BQU8sRUFBRSxHQUFHLEtBQUssQ0FBQztRQUMvQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQztRQUMxQixJQUFJLEdBQUcsR0FBRyxPQUFPLEdBQUcsR0FBRyxDQUFDO1FBQ3hCLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUU7WUFDOUIsaUJBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEVB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