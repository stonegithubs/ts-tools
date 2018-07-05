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
                    utils_2.log(err, resp.statusCode, body, 'error');
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
        // pic.on('error', e => {
        //   log(e, 'error');
        // })
        // pic.on('data', m => {
        //   log(m+'');
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
            try {
                let [mobile] = await dz.getMobileNums();
                let params = Object.assign({ mobile, areaCode: '86' }, form);
                do {
                    try {
                        let result = await this.getData('/mobileVerificationCode', params);
                        if (result.errcode === 0 && result.result === 200) {
                            utils_2.log('短信发送成功！');
                            let { message } = await dz.getMessageByMobile(mobile);
                            if (message) {
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
                            else {
                                // 手机接收验证码失败，可能是因为手机号已经被 DZ 释放
                                utils_2.log('手机接收验证码失败，可能是因为手机号已经被 DZ 释放', 'error');
                                break;
                            }
                        }
                        else if (result.errcode === 0 && result.result === 1) { // 手机号已注册
                            dz.addIgnoreList(mobile); // 手机号加黑
                            break;
                        }
                    }
                    catch (error) {
                        utils_2.log('获取手机验证码失败:\t', error, 'error');
                    }
                } while (await utils_2.wait(2000, true));
            }
            catch (error) {
                utils_2.log('获取手机号失败:\t', error, 'error');
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
                utils_2.log(error, 'error');
                if (error && error.result) {
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