"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = __importDefault(require("ioredis"));
const request_1 = __importDefault(require("request"));
const request_promise_1 = __importDefault(require("request-promise"));
const chaojiying_1 = __importDefault(require("../../lib/chaojiying"));
const utils_1 = require("../../lib/mail/utils");
// import Req from '../../lib/request';
let redis = new ioredis_1.default({
    host: 'chosan.cn',
    password: '199381'
});
class Epnex {
    constructor(proxy = 'http://chosan.cn:12345') {
        this.proxy = proxy;
        redis.subscribe('mailReceived', (err, count) => {
            if (err) {
                throw new Error(err.message);
            }
            else {
                console.log(`当前第 ${count} 位订阅 mailReceived 的用户`);
            }
        });
    }
    register() {
        return false;
    }
    getData(uri, body = {}) {
        let { baseUrl, commonHeader: headers } = Epnex;
        let { proxy, jar } = this;
        // let rjar = Req.jar();
        // rjar.setCookie('')
        let url = baseUrl + uri;
        return request_promise_1.default.post(url, { form: body, headers, proxy, jar });
    }
    async getEmailValidCode(PvilidCode) {
        let user_email = utils_1.gMail();
        let sendResult = await this.getData('/emailValidCode', JSON.stringify({ user_email, PvilidCode }));
        if (sendResult.errcode === 0 && sendResult.result === 200) {
            redis.on('message', (channel, message) => {
                if (channel === 'mailReceived') {
                    let msg = JSON.parse(message);
                    if (msg) {
                        //
                    }
                }
            });
        }
        else {
            throw new Error('邮箱验证码发送失败!');
        }
    }
    async getPvilidCode() {
        let { baseUrl, commonHeader: headers } = Epnex;
        let { proxy } = this;
        let jar = this.jar = request_1.default.jar();
        let cjy = new chaojiying_1.default('179817004', 'Mailofchaojiying*');
        let pic = request_1.default(baseUrl + '/userValidateCode', { jar, proxy, headers });
        let code = await cjy.validate(pic, '1005', '896776').then(data => {
            if (data.err_no === 0 && data.err_str === 'OK') {
                return data.pic_str;
            }
            else {
                throw new Error(data.err_str);
            }
        });
        return code;
    }
    async task() {
        let pvCode = await this.getPvilidCode();
        // let emailCode =
        await this.getEmailValidCode(pvCode);
    }
}
Epnex.baseUrl = 'https://epnex.io/api';
Epnex.commonHeader = {
    Host: 'epnex.io',
    Origin: 'https://epnex.io',
    Referer: 'https://epnex.io/phoneSelf_sign.html?i=00VHmxY&lan=0',
    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1'
};
exports.default = Epnex;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXBuZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29uc3VtZXJzL2VwbmV4L2VwbmV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsc0RBQTRCO0FBQzVCLHNEQUF5QjtBQUN6QixzRUFBaUM7QUFDakMsc0VBQThDO0FBQzlDLGdEQUE2QztBQUM3Qyx1Q0FBdUM7QUFFdkMsSUFBSSxLQUFLLEdBQUcsSUFBSSxpQkFBSyxDQUFDO0lBQ3BCLElBQUksRUFBRSxXQUFXO0lBQ2pCLFFBQVEsRUFBRSxRQUFRO0NBQ25CLENBQUMsQ0FBQztBQUVIO0lBU0UsWUFBbUIsUUFBZ0Isd0JBQXdCO1FBQXhDLFVBQUssR0FBTCxLQUFLLENBQW1DO1FBQ3pELEtBQUssQ0FBQyxTQUFTLENBQUMsY0FBYyxFQUFFLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxFQUFFO1lBQzdDLElBQUksR0FBRyxFQUFFO2dCQUNQLE1BQU0sSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2FBQzlCO2lCQUFNO2dCQUNMLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxLQUFLLHVCQUF1QixDQUFDLENBQUM7YUFDbEQ7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFDRCxRQUFRO1FBQ04sT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDO0lBQ0QsT0FBTyxDQUFDLEdBQVcsRUFBRSxPQUFZLEVBQUU7UUFDakMsSUFBSSxFQUFFLE9BQU8sRUFBRSxZQUFZLEVBQUUsT0FBTyxFQUFFLEdBQUcsS0FBSyxDQUFDO1FBQy9DLElBQUksRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDO1FBQzFCLHdCQUF3QjtRQUN4QixxQkFBcUI7UUFDckIsSUFBSSxHQUFHLEdBQUcsT0FBTyxHQUFHLEdBQUcsQ0FBQztRQUN4QixPQUFPLHlCQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxFQUFFLElB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