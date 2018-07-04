"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = __importDefault(require("ioredis"));
const request_1 = __importDefault(require("request"));
const mongo_1 = __importDefault(require("../../lib/mongo/"));
const chaojiying_1 = __importDefault(require("../../lib/chaojiying"));
const utils_1 = require("../../lib/mail/utils");
const dz_1 = __importDefault(require("../../lib/SMS/dz/"));
const utils_2 = require("../../lib/utils");
const xundaili_1 = __importStar(require("../../lib/proxy/xundaili"));
const https_proxy_agent_1 = __importDefault(require("https-proxy-agent")); //第三方包,请安装
const url_1 = require("url");
//  --------- redis ---------
const redis = new ioredis_1.default({ host: 'chosan.cn', password: '199381' });
redis.subscribe('mailReceived', (err, count) => err ? utils_2.throwError(err.message) : console.log(`当前第 ${count} 位订阅 mailReceived 的用户`));
//  --------- 超级鹰 ---------
const cjy = new chaojiying_1.default('179817004', 'Mailofchaojiying*', '896776');
//  --------- DZ ---------
const dz = new dz_1.default('zhang179817004', 'qq179817004*', '46021');
//  --------- MongoDB ---------
const xdl = new xundaili_1.default({ orderno: 'ZF2018744533NVHTc0', secret: '944417ea359346e4ad882483cb63c13c' });
//  --------- MongoDB ---------
const mongo = new mongo_1.default();
//  --------- 错误枚举类型 ---------
var ErrorType;
(function (ErrorType) {
    ErrorType[ErrorType["WrongPvilidCode"] = 1] = "WrongPvilidCode";
})(ErrorType || (ErrorType = {}));
//  --------- Epnex ---------
class Epnex {
    constructor(invitation) {
        this.invitation = invitation;
        this.proxy = xundaili_1.dynamicForwardURL;
    }
    getData(uri, form = {}, params = {}) {
        let { baseUrl, commonHeader: headers } = Epnex;
        let { proxy, jar } = this;
        let url = baseUrl + uri;
        // let url = uri;
        return new Promise((res, rej) => {
            headers = xdl.wrapHeader(Object.assign({}, headers, params.header));
            let agent = new https_proxy_agent_1.default(Object.assign({}, url_1.parse(proxy), { headers }));
            form = typeof form === 'string' ? form : JSON.stringify(form);
            request_1.default.post(url, Object.assign({ form, headers, jar, rejectUnauthorized: false, agent }, params), function (err, resp, body) {
                if (err || resp.statusCode !== 200) {
                    rej(err || resp.statusMessage);
                }
                else {
                    res(typeof body === 'string' ? JSON.parse(body) : body);
                }
            });
        });
    }
    // 使用邮箱和验证码注册账号
    async register(form) {
        if (form) {
            let { invitation } = this;
            let result = await this.getData('/Registered', Object.assign({ invitation }, form));
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
    // 使用识别得到的图片验证码发送邮件, 获取邮箱验证码
    async getEmailValidCode(PvilidCode) {
        if (!PvilidCode)
            throw new Error('获取邮件验证码函数必要参数缺失！');
        let user_email = utils_1.gMail();
        let sendResult = await this.getData('/emailValidCode', { user_email, PvilidCode });
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
                rej({ message: '邮箱验证码发送失败!', errCode: ErrorType.WrongPvilidCode, result: sendResult });
            }
        });
    }
    // 获取图片验证码, 使用超级鹰识别, 返回识别的验证码文本或抛出错误
    async getPvilidCode() {
        let { baseUrl, commonHeader: headers } = Epnex;
        let { proxy } = this;
        let jar = this.jar = request_1.default.jar();
        headers = xdl.wrapHeader(headers);
        let agent = new https_proxy_agent_1.default(Object.assign({}, url_1.parse(proxy), { headers }));
        let pic = request_1.default(baseUrl + '/userValidateCode', { jar //, proxy //: 'http://chosan.cn:12345'
            ,
            headers, rejectUnauthorized: false, agent });
        // pic.on('error', e => {
        //   console.log(e);
        // })
        // pic.on('data', m => {
        //   console.log(m+'');
        // })
        let codeObj = await cjy.validate(pic, '1005');
        if (codeObj && codeObj.err_no === 0 && codeObj.err_str === 'OK') {
            return codeObj;
        }
        else {
            throw new Error(codeObj && codeObj.err_str || '识别图片验证码错误!');
        }
    }
    // 验证手机号
    async validatePhone(form) {
        do {
            let [mobile] = await dz.getMobileNums();
            let params = Object.assign({ mobile, areaCode: '86' }, form);
            let result = await this.getData('/mobileVerificationCode', params);
            if (result.errcode === 0 && result.result === 200) {
                let { message } = await dz.getMessageByMobile(mobile);
                let phoneCode = message.match(/(\d+)/)[1];
                let sendCodeResult = await this.getData('/bindpPhoneNumber', Object.assign({ phoneCode }, params));
                if (sendCodeResult.errcode === 0 && sendCodeResult.result === 200) {
                    // 注册成功
                    // 模拟 /selectUserPoster 进行分享
                    return { mobile };
                }
            }
            else if (result.errcode === 0 && result.result === 1) { // 手机号已注册
                dz.addIgnoreList(mobile); // 手机号加黑
            }
        } while (await utils_2.wait(2000, true));
    }
    async login(form) {
        return this.getData('/userLogin.do', form);
    }
    async task() {
        // this.getData('https://chosan.cn');
        // return;
        let dataHolds = {}; // 用于记录 try 中的返回值, 在 catch 中可能用到
        do {
            try {
                let { pic_str } = dataHolds.getPvilidCode = await this.getPvilidCode();
                let emailAndCode = dataHolds.getEmailValidCode = await this.getEmailValidCode(pic_str);
                let user_password = utils_2.getRandomStr(12, 8);
                let regResult = dataHolds.register = await this.register(Object.assign({ user_password }, emailAndCode));
                if (regResult.errcode === 0 && regResult.result === 200) {
                    // 注册成功, 执行登陆
                    let { user_email } = emailAndCode;
                    let loginData = dataHolds.login = await this.login({ user_password, user_email });
                    if (loginData && loginData.result === 200) {
                        let token = JSON.parse(loginData.data)[0].token;
                        // 模拟 /Initial
                        // 模拟 /updateInvition
                        // 模拟 https://epnex.io/static/js/countryzz.json
                        // 进行手机验证。
                        let phoneData = dataHolds.validatePhone = await this.validatePhone(Object.assign({ token }, emailAndCode));
                        let col = await mongo.getCollection('epnex', 'regists');
                        col.insertOne(Object.assign({ user_email, user_password }, phoneData));
                    }
                }
                break; // 程序无异常, 跳出 while 循环
            }
            catch (error) {
                if (error && error.result) {
                    console.log(error);
                    switch (error.errCode) {
                        case ErrorType.WrongPvilidCode: // 验证码识别错误, 将错误反馈给超级鹰
                            cjy.reportError(dataHolds.getPvilidCode.pic_id);
                            break;
                        default:
                            break;
                    }
                }
            }
        } while (await utils_2.wait(1000, true));
    }
}
Epnex.baseUrl = 'https://epnex.io/api';
Epnex.commonHeader = {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    Host: 'epnex.io',
    Origin: 'https://epnex.io',
    Referer: 'https://epnex.io/phoneSelf_sign.html?i=00TPBBT&lan=0',
    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1'
};
exports.default = Epnex;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXBuZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29uc3VtZXJzL2VwbmV4L2VwbmV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLHNEQUE0QjtBQUM1QixzREFBeUI7QUFDekIsNkRBQXFDO0FBQ3JDLHNFQUE4QztBQUM5QyxnREFBNkM7QUFDN0MsMkRBQW1DO0FBQ25DLDJDQUFpRTtBQUNqRSxxRUFBdUU7QUFFdkUsMEVBQWdELENBQUMsVUFBVTtBQUMzRCw2QkFBNEI7QUFFNUIsNkJBQTZCO0FBRTdCLE1BQU0sS0FBSyxHQUFHLElBQUksaUJBQUssQ0FBQyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUM7QUFFbkUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLGtCQUFVLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sS0FBSyx1QkFBdUIsQ0FBQyxDQUFDLENBQUM7QUFFbEksMkJBQTJCO0FBRTNCLE1BQU0sR0FBRyxHQUFHLElBQUksb0JBQVUsQ0FBQyxXQUFXLEVBQUUsbUJBQW1CLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFFdkUsMEJBQTBCO0FBRTFCLE1BQU0sRUFBRSxHQUFHLElBQUksWUFBRSxDQUFDLGdCQUFnQixFQUFFLGNBQWMsRUFBRSxPQUFPLENBQUMsQ0FBQztBQUU3RCwrQkFBK0I7QUFFL0IsTUFBTSxHQUFHLEdBQUcsSUFBSSxrQkFBUSxDQUFDLEVBQUUsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sRUFBRSxrQ0FBa0MsRUFBRSxDQUFDLENBQUM7QUFFeEcsK0JBQStCO0FBRS9CLE1BQU0sS0FBSyxHQUFHLElBQUksZUFBSyxFQUFF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