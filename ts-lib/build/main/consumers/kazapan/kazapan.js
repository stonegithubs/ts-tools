"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = __importDefault(require("ioredis"));
const chaojiying_1 = __importDefault(require("../../lib/chaojiying"));
const utils_1 = require("../../lib/mail/utils");
const mongo_1 = __importDefault(require("../../lib/mongo/"));
const xundaili_1 = __importDefault(require("../../lib/proxy/xundaili"));
const dz_1 = __importDefault(require("../../lib/SMS/dz/"));
const utils_2 = require("../../lib/utils");
const request_1 = __importDefault(require("../../lib/request"));
const localLib_1 = require("./local_lib/localLib");
//  --------- redis ---------
const redis = new ioredis_1.default({ host: 'chosan.cn', password: '199381' });
redis.subscribe('mailReceived', (err, count) => err ? utils_2.throwError(err.message) : utils_2.log(`当前第 ${count} 位订阅 mailReceived 的用户`));
//  --------- 超级鹰 ---------
const cjy = new chaojiying_1.default('179817004', 'Mailofchaojiying*', '896776');
//  --------- DZ ---------
const dz = new dz_1.default('zhang179817004', 'qq179817004*', '46021');
//  --------- XunDaili ---------
const xdl = new xundaili_1.default({ orderno: 'ZF2018730302kdQRPU', secret: '944417ea359346e4ad882483cb63c13c' }); // ZF2018744533NVHTc0 ZF2018730302kdQRPU
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
            do {
                try {
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
                }
                catch (error) {
                    utils_2.log('发送验证码失败！', error, 'error');
                }
            } while (await utils_2.wait(2000, true));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2F6YXBhbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb25zdW1lcnMva2F6YXBhbi9rYXphcGFuLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsc0RBQTRCO0FBRTVCLHNFQUE4QztBQUM5QyxnREFBNkM7QUFDN0MsNkRBQXFDO0FBQ3JDLHdFQUF1RTtBQUN2RSwyREFBbUM7QUFDbkMsMkNBQThGO0FBRTlGLGdFQUFzQztBQUN0QyxtREFBK0M7QUFFL0MsNkJBQTZCO0FBRTdCLE1BQU0sS0FBSyxHQUFHLElBQUksaUJBQUssQ0FBQyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUM7QUFFbkUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLGtCQUFVLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFHLENBQUMsT0FBTyxLQUFLLHVCQUF1QixDQUFDLENBQUMsQ0FBQztBQUUxSCwyQkFBMkI7QUFFM0IsTUFBTSxHQUFHLEdBQUcsSUFBSSxvQkFBVSxDQUFDLFdBQVcsRUFBRSxtQkFBbUIsRUFBRSxRQUFRLENBQUMsQ0FBQztBQUV2RSwwQkFBMEI7QUFFMUIsTUFBTSxFQUFFLEdBQUcsSUFBSSxZQUFFLENBQUMsZ0JBQWdCLEVBQUUsY0FBYyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBRTdELGdDQUFnQztBQUVoQyxNQUFNLEdBQUcsR0FBRyxJQUFJLGtCQUFRLENBQUMsRUFBRSxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxFQUFFLGtDQUFrQyxFQUFFLENBQUMsQ0FBQyxDQUFDLHdDQUF3QztBQUVqSiwrQkFBK0I7QUFFL0IsTUFBTSxLQUFLLEdBQUcsSUFBSSxlQUFLLEVBQUUsQ0FBQztBQUUxQiw4QkFBOEI7QUFH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