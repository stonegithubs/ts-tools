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
        // let url = baseUrl + uri;
        let url = uri;
        return new Promise((res, rej) => {
            headers = xdl.wrapHeader(Object.assign({}, headers, params.header));
            form = typeof form === 'string' ? form : JSON.stringify(form);
            request_1.default.post(url, Object.assign({ form, headers, proxy, jar, rejectUnauthorized: false }, params), function (err, resp, body) {
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
        let pic = request_1.default(baseUrl + '/userValidateCode', { jar, proxy //: 'http://chosan.cn:12345'
            ,
            headers, rejectUnauthorized: false, tunnel: false });
        pic.on('error', e => {
            console.log(e);
        });
        pic.on('data', m => {
            console.log(m);
        });
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
        this.getData('https://chosan.cn');
        return;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXBuZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29uc3VtZXJzL2VwbmV4L2VwbmV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLHNEQUE0QjtBQUM1QixzREFBeUI7QUFDekIsNkRBQXFDO0FBQ3JDLHNFQUE4QztBQUM5QyxnREFBNkM7QUFDN0MsMkRBQW1DO0FBQ25DLDJDQUFpRTtBQUNqRSxxRUFBdUU7QUFHdkUsNkJBQTZCO0FBRTdCLE1BQU0sS0FBSyxHQUFHLElBQUksaUJBQUssQ0FBQyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUM7QUFFbkUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLGtCQUFVLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sS0FBSyx1QkFBdUIsQ0FBQyxDQUFDLENBQUM7QUFFbEksMkJBQTJCO0FBRTNCLE1BQU0sR0FBRyxHQUFHLElBQUksb0JBQVUsQ0FBQyxXQUFXLEVBQUUsbUJBQW1CLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFFdkUsMEJBQTBCO0FBRTFCLE1BQU0sRUFBRSxHQUFHLElBQUksWUFBRSxDQUFDLGdCQUFnQixFQUFFLGNBQWMsRUFBRSxPQUFPLENBQUMsQ0FBQztBQUU3RCwrQkFBK0I7QUFFL0IsTUFBTSxHQUFHLEdBQUcsSUFBSSxrQkFBUSxDQUFDLEVBQUUsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sRUFBRSxrQ0FBa0MsRUFBRSxDQUFDLENBQUM7QUFFeEcsK0JBQStCO0FBRS9CLE1BQU0sS0FBSyxHQUFHLElBQUksZUFBSyxFQUFFLENBQUM7QUFFMUIsOEJBQThCO0FBRTlCLElBQUssU0FFSjtB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