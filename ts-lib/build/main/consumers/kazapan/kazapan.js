"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = __importDefault(require("ioredis"));
const chaojiying_1 = __importDefault(require("../../lib/chaojiying"));
const utils_1 = require("../../lib/mail/utils");
const mongo_1 = __importDefault(require("../../lib/mongo"));
const xundaili_1 = __importDefault(require("../../lib/proxy/xundaili"));
const dz_1 = __importDefault(require("../../lib/SMS/dz/"));
const utils_2 = require("../../lib/utils");
const request_1 = __importDefault(require("../../lib/request"));
const localLib_1 = require("./local_lib/localLib");
//  --------- redis ---------
const redis = new ioredis_1.default({ host: 'mlo.kim', password: '199381' });
redis.subscribe('mailReceived', (err, count) => err ? utils_2.throwError(err.message) : utils_2.log(`当前第 ${count} 位订阅 mailReceived 的用户`));
//  --------- 超级鹰 ---------
const cjy = new chaojiying_1.default('179817004', 'Mailofchaojiying*', '896776');
//  --------- DZ ---------
const dz = new dz_1.default('zhang179817004', 'qq179817004*', '46021');
//  --------- XunDaili ---------
const xdl = new xundaili_1.default({ orderno: 'ZF20187249103GcJiAA', secret: 'f7691def90804df3ba830c1a1308a718' }); // ZF2018744533NVHTc0 ZF20187249103GcJiAA
//  --------- MongoDB ---------
const mongo = new mongo_1.default();
//  --------- 错误枚举类型 ---------
class KZP {
    constructor(inviter) {
        this.inviter = inviter;
        this.requester = new request_1.default('http://www.kazapan.com', { json: false });
    }
    async getData(url, data, method = 'get', params) {
        let { requester, inviter } = this;
        let headers = {
            Host: 'www.kazapan.com',
            Referer: `http://www.kazapan.com/signup_en.html?inviter=${inviter}`,
            'X-Requested-With': 'XMLHttpRequest',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36'
        };
        let result = await requester.workFlow(url, data, method, Object.assign({ headers }, params));
        try {
            return typeof result === 'string' ? JSON.parse(result) : result;
        }
        catch (error) {
            utils_2.log('getData解析出错', error, 'error');
        }
        return result;
    }
    async getCaptcha() {
        do {
            try {
                let cap = await this.getData('/blockchain/auth/code');
                if (cap.code && cap.pngBase64) {
                    return cap.code;
                }
            }
            catch (error) {
                utils_2.log('获取图片验证码出错', error, 'error');
            }
        } while (await utils_2.wait(2000, true));
    }
    getEmailCode() {
        return new Promise(async (res, rej) => {
            // do {
            //     try {
            let email = utils_1.gMail();
            let result = await this.getData(`/blockchain/verifyCode/sendEmail?email=${email}`);
            if (result) {
                redis.on('message', (channel, message) => {
                    if (channel === 'mailReceived') {
                        let msg = JSON.parse(message);
                        if (msg && msg.to.value[0].address === email) {
                            let verifyCode = msg.html.match(/(\d+)/)[1];
                            res({ verifyCode, email });
                        }
                    }
                });
            }
            //     } catch (error) {
            //         log('发送验证码失败！', error, 'error');
            //     }
            // } while (await wait(2000, true));
        });
    }
    async register() {
        let { inviter: requestid } = this;
        let emailData = await this.getEmailCode();
        let originPassword = utils_2.getRandomStr(15, 12);
        let password = localLib_1.hex_md5(originPassword);
        do {
            try {
                let data = Object.assign({}, emailData, { password,
                    requestid });
                let result = await this.getData('/blockchain/userInfo/register', data);
                if (result.errorCode == 'true') {
                    return data;
                }
            }
            catch (error) {
                utils_2.log('注册错误', error, 'error');
            }
        } while (await utils_2.wait(2000, true));
    }
    async task() {
        await this.register();
        await this.getData('/userCenter_en.html');
    }
}
exports.default = KZP;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2F6YXBhbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb25zdW1lcnMva2F6YXBhbi9rYXphcGFuLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsc0RBQTRCO0FBRTVCLHNFQUE4QztBQUM5QyxnREFBNkM7QUFDN0MsNERBQW9DO0FBQ3BDLHdFQUF1RTtBQUN2RSwyREFBbUM7QUFDbkMsMkNBQThGO0FBRTlGLGdFQUFzQztBQUN0QyxtREFBK0M7QUFFL0MsNkJBQTZCO0FBRTdCLE1BQU0sS0FBSyxHQUFHLElBQUksaUJBQUssQ0FBQyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUM7QUFFakUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLGtCQUFVLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFHLENBQUMsT0FBTyxLQUFLLHVCQUF1QixDQUFDLENBQUMsQ0FBQztBQUUxSCwyQkFBMkI7QUFFM0IsTUFBTSxHQUFHLEdBQUcsSUFBSSxvQkFBVSxDQUFDLFdBQVcsRUFBRSxtQkFBbUIsRUFBRSxRQUFRLENBQUMsQ0FBQztBQUV2RSwwQkFBMEI7QUFFMUIsTUFBTSxFQUFFLEdBQUcsSUFBSSxZQUFFLENBQUMsZ0JBQWdCLEVBQUUsY0FBYyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBRTdELGdDQUFnQztBQUVoQyxNQUFNLEdBQUcsR0FBRyxJQUFJLGtCQUFRLENBQUMsRUFBRSxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxFQUFFLGtDQUFrQyxFQUFFLENBQUMsQ0FBQyxDQUFDLHlDQUF5QztBQUVuSiwrQkFBK0I7QUFFL0IsTUFBTSxLQUFLLEdBQUcsSUFBSSxlQUFLLEVBQUUsQ0FBQztBQUUxQiw4QkFBOEI7QUFH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