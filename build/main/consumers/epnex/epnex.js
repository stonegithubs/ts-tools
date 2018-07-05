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
const chaojiying_1 = __importDefault(require("../../lib/chaojiying"));
const utils_1 = require("../../lib/mail/utils");
const mongo_1 = __importDefault(require("../../lib/mongo/"));
const xundaili_1 = __importStar(require("../../lib/proxy/xundaili"));
const dz_1 = __importDefault(require("../../lib/SMS/dz/"));
const utils_2 = require("../../lib/utils");
//  --------- redis ---------
const redis = new ioredis_1.default({ host: 'chosan.cn', password: '199381' });
redis.subscribe('mailReceived', (err, count) => err ? utils_2.throwError(err.message) : utils_2.log(`当前第 ${count} 位订阅 mailReceived 的用户`));
//  --------- 超级鹰 ---------
const cjy = new chaojiying_1.default('179817004', 'Mailofchaojiying*', '896776');
//  --------- DZ ---------
const dz = new dz_1.default('zhang179817004', 'qq179817004*', '46021');
//  --------- MongoDB ---------
const xdl = new xundaili_1.default({ orderno: 'ZF2018730302kdQRPU', secret: '944417ea359346e4ad882483cb63c13c' }); // ZF2018744533NVHTc0 ZF2018730302kdQRPU
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
    getData(uri, form = {}) {
        let { baseUrl, commonHeader: headers } = Epnex;
        let { proxy, jar } = this;
        let url = baseUrl + uri;
        return new Promise((res, rej) => {
            form = typeof form === 'string' ? form : JSON.stringify(form);
            request_1.default.post(url, xdl.wrapParams({ form, headers, jar }), (err, resp, body) => {
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
                rej({ message: '邮箱验证码发送失败!', errCode: ErrorType.WrongPvilidCode, result: Object.assign({}, sendResult, { date: new Date().toLocaleString() }) });
            }
        });
    }
    // 获取图片验证码, 使用超级鹰识别, 返回识别的验证码文本或抛出错误
    async getPvilidCode() {
        let { baseUrl, commonHeader: headers } = Epnex;
        let { proxy } = this;
        let jar = this.jar = request_1.default.jar();
        let params = xdl.wrapParams({ jar, headers });
        let pic = request_1.default(baseUrl + '/userValidateCode', params);
        pic.on('error', e => {
            utils_2.log(e, 'error');
        });
        pic.on('data', m => {
            utils_2.log(m + '');
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
                else {
                    utils_2.log(sendCodeResult, 'error');
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
        let dataHolds = {}; // 用于记录 try 中的返回值, 在 catch 中可能用到
        let count = 0;
        do {
            try {
                utils_2.log(`第\t${++count}\t次开始!`);
                let { pic_str } = dataHolds.getPvilidCode = await this.getPvilidCode();
                utils_2.log('注册完成! 验证码:\t', pic_str, '\t即将开始获取邮箱验证码!');
                let emailAndCode = dataHolds.getEmailValidCode = await this.getEmailValidCode(pic_str);
                utils_2.log('邮箱验证码已获取! 验证码:\t', emailAndCode, '\t即将注册!');
                let user_password = utils_2.getRandomStr(12, 8);
                let regResult = dataHolds.register = await this.register(Object.assign({ user_password }, emailAndCode));
                utils_2.log('邮箱验证码已获取! 验证码:\t', emailAndCode, '\t即将登陆!');
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
                        let waitTimt = utils_2.getRandomInt(5, 2);
                        utils_2.log(`登陆成功! 等待 ${waitTimt} 分钟后进行手机号验证!`);
                        await utils_2.wait(waitTimt * 1000 * 60);
                        utils_2.log(`开始进行手机号验证!`);
                        let phoneData = dataHolds.validatePhone = await this.validatePhone(Object.assign({ token }, emailAndCode));
                        utils_2.log(`手机号验证完成!手机号和验证码为:\t`, phoneData, '\t现在获取数据库句柄!');
                        let col = await mongo.getCollection('epnex', 'regists');
                        utils_2.log('数据库句柄已获取, 现在将注册信息写入数据库!');
                        let { invitation } = this;
                        let successItem = Object.assign({ user_email, user_password }, phoneData, { invitation, date: new Date().toLocaleString() });
                        col.insertOne(successItem);
                        utils_2.log('注册成功!注册信息为:\t', successItem);
                    }
                }
                break; // 程序无异常, 跳出 while 循环
            }
            catch (error) {
                if (error && error.result) {
                    utils_2.log(error, 'error');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXBuZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29uc3VtZXJzL2VwbmV4L2VwbmV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLHNEQUE0QjtBQUM1QixzREFBeUI7QUFDekIsc0VBQThDO0FBQzlDLGdEQUE2QztBQUM3Qyw2REFBcUM7QUFDckMscUVBQXVFO0FBQ3ZFLDJEQUFtQztBQUNuQywyQ0FBb0Y7QUFFcEYsNkJBQTZCO0FBRTdCLE1BQU0sS0FBSyxHQUFHLElBQUksaUJBQUssQ0FBQyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUM7QUFFbkUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLGtCQUFVLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFHLENBQUMsT0FBTyxLQUFLLHVCQUF1QixDQUFDLENBQUMsQ0FBQztBQUUxSCwyQkFBMkI7QUFFM0IsTUFBTSxHQUFHLEdBQUcsSUFBSSxvQkFBVSxDQUFDLFdBQVcsRUFBRSxtQkFBbUIsRUFBRSxRQUFRLENBQUMsQ0FBQztBQUV2RSwwQkFBMEI7QUFFMUIsTUFBTSxFQUFFLEdBQUcsSUFBSSxZQUFFLENBQUMsZ0JBQWdCLEVBQUUsY0FBYyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBRTdELCtCQUErQjtBQUUvQixNQUFNLEdBQUcsR0FBRyxJQUFJLGtCQUFRLENBQUMsRUFBRSxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxFQUFFLGtDQUFrQyxFQUFFLENBQUMsQ0FBQyxDQUFDLHdDQUF3QztBQUVqSiwrQkFBK0I7QUFFL0IsTUFBTSxLQUFLLEdBQUcsSUFBSSxlQUFLLEVBQUUsQ0FBQztBQUUxQiw4QkFBOEI7QUFFOUIsSUFBSyxTQUVK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