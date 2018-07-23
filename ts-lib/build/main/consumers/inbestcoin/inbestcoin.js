"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = __importDefault(require("ioredis"));
const request_1 = __importDefault(require("request"));
const chaojiying_1 = __importDefault(require("../../lib/chaojiying"));
const utils_1 = require("../../lib/mail/utils");
const mongo_1 = __importDefault(require("../../lib/mongo/"));
const xundaili_1 = __importDefault(require("../../lib/proxy/xundaili"));
const dz_1 = __importDefault(require("../../lib/SMS/dz/"));
const utils_2 = require("../../lib/utils");
const request_2 = __importDefault(require("../../lib/request"));
const md5_1 = require("./statics/md5");
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
class INBEST {
    constructor(referralCode) {
        this.referralCode = referralCode;
        this.baseURL = 'http://www.inbestcoin.com';
        this.requester = new request_2.default('http://www.inbestcoin.com', { json: false });
        this.headers = {
            Host: 'www.inbestcoin.com',
            Referer: `http://www.inbestcoin.com/regcode/${this.referralCode}`,
            'User-Agent': utils_2.randomUA()
        };
        this.jar = request_1.default.jar();
    }
    async getData(url, data, method = 'get', params) {
        let { requester, headers } = this;
        let oParams = Object.assign({ headers }, params);
        return requester.workFlow(url, data, method, xdl.wrapParams(oParams));
    }
    async getPvilidCode() {
        let { jar, baseURL, headers } = this;
        let params = xdl.wrapParams({ jar, headers });
        let url = 'http://www.inbestcoin.com/sms/registcode.jpg';
        let pic = request_1.default(url, params);
        pic.on('error', e => {
            utils_2.log(e, 'error');
        });
        pic.on('data', m => {
            utils_2.log(m + '');
        });
        let codeObj = await cjy.validate(pic, '6001');
        if (codeObj && codeObj.err_no === 0 && codeObj.err_str === 'OK') {
            return codeObj;
        }
        else {
            throw new Error(codeObj && codeObj.err_str || '识别图片验证码错误!');
        }
    }
    async getHTML() {
        return this.getData(`/regcode/${this.referralCode}`);
    }
    async register() {
        do {
            try {
                await this.getHTML();
                let { pic_str: registCode } = await this.getPvilidCode();
                let originPassword = utils_2.getRandomStr(15, 12);
                let password = md5_1.inbest_md5(originPassword);
                let email = utils_1.gMail();
                let { referralCode } = this;
                let params = {
                    password, registCode, email, referralCode
                };
                let result = await this.getData('/registService', params, 'post');
                if (result) {
                    let col = await mongo.getCollection('inbest', 'regists');
                    col.insertOne(params);
                    ;
                    break;
                }
            }
            catch (error) {
                utils_2.log('注册发生错误！', error, 'error');
            }
        } while (await utils_2.wait(2000, true));
    }
}
exports.default = INBEST;
redis.on('message', async (channel, message) => {
    if (channel === 'mailReceived') {
        let msg = JSON.parse(message);
        let address = msg && msg.to.value[0].address;
        if (msg) {
            let validUrl = msg.html.match(/http:\/\/[^\s]+/)[0];
            let result = await request_2.default.getData(validUrl);
            utils_2.log(result);
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5iZXN0Y29pbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb25zdW1lcnMvaW5iZXN0Y29pbi9pbmJlc3Rjb2luLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsc0RBQTRCO0FBQzVCLHNEQUF5QjtBQUN6QixzRUFBOEM7QUFDOUMsZ0RBQTZDO0FBQzdDLDZEQUFxQztBQUNyQyx3RUFBdUU7QUFDdkUsMkRBQW1DO0FBQ25DLDJDQUE4RjtBQUU5RixnRUFBc0M7QUFDdEMsdUNBQTJDO0FBRTNDLDZCQUE2QjtBQUU3QixNQUFNLEtBQUssR0FBRyxJQUFJLGlCQUFLLENBQUMsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDO0FBRW5FLEtBQUssQ0FBQyxTQUFTLENBQUMsY0FBYyxFQUFFLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxrQkFBVSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBRyxDQUFDLE9BQU8sS0FBSyx1QkFBdUIsQ0FBQyxDQUFDLENBQUM7QUFFMUgsMkJBQTJCO0FBRTNCLE1BQU0sR0FBRyxHQUFHLElBQUksb0JBQVUsQ0FBQyxXQUFXLEVBQUUsbUJBQW1CLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFFdkUsMEJBQTBCO0FBRTFCLE1BQU0sRUFBRSxHQUFHLElBQUksWUFBRSxDQUFDLGdCQUFnQixFQUFFLGNBQWMsRUFBRSxPQUFPLENBQUMsQ0FBQztBQUU3RCxnQ0FBZ0M7QUFFaEMsTUFBTSxHQUFHLEdBQUcsSUFBSSxrQkFBUSxDQUFDLEVBQUUsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sRUFBRSxrQ0FBa0MsRUFBRSxDQUFDLENBQUMsQ0FBQyx3Q0FBd0M7QUFFakosK0JBQStCO0FBRS9CLE1BQU0sS0FBSyxHQUFHLElBQUksZUFBSyxFQUFF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