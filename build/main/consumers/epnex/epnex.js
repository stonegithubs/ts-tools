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
        let { jar } = this;
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
            do {
                let result = await this.getData('/Registered', Object.assign({ invitation }, form));
                if (result.errcode === 0 && result.result === 200) {
                    return result;
                }
                else if (result.errcode === 0 && result.result === 4) { // 验证码不正确，抛出错误，重新获取验证码和邮箱
                    throw new Error(`注册错误！错误消息:\t${JSON.stringify(result)}`);
                }
            } while (await utils_2.wait(2000, true));
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
                        else if (result.errcode === 0 && result.result === 3) { // 该用户已绑定手机号
                            utils_2.log(result, 'error');
                            return;
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
                utils_2.log(`第\t${++count}\t次开始，进行图片识别！`);
                let { pic_str } = dataHolds.getPvilidCode = await this.getPvilidCode();
                utils_2.log('图片验证码已获取! 验证码:\t', pic_str, '\t即将开始获取邮箱验证码!');
                let emailAndCode = dataHolds.getEmailValidCode = await this.getEmailValidCode(pic_str);
                utils_2.log('邮箱验证码已获取! 验证码:\t', emailAndCode, '\t即将注册!');
                let user_password = utils_2.getRandomStr(12, 8);
                let regResult = dataHolds.register = await this.register(Object.assign({ user_password }, emailAndCode));
                if (regResult.errcode === 0 && regResult.result === 200) {
                    // 注册成功, 执行登陆
                    utils_2.log('注册已完成! 注册结果:\t', regResult, '\t即将登陆!');
                    let { user_email } = emailAndCode;
                    let loginData = dataHolds.login = await this.login({ user_password, user_email });
                    if (loginData && loginData.result === 200) {
                        let loginInfo = JSON.parse(loginData.data)[0];
                        let token = loginInfo.token;
                        // 进行手机验证。
                        let waitTimt = utils_2.getRandomInt(5, 2);
                        utils_2.log(`登陆成功! 等待 ${waitTimt} 分钟后进行手机号验证!`);
                        await utils_2.wait(waitTimt * 1000 * 60);
                        try {
                            // 以下为模拟用户操作, 不关心是否成功!
                            // 模拟 /Initial
                            await this.getData('/Initial', loginInfo);
                            // 模拟 /updateInvition
                            await this.getData('/updateInvition', loginInfo);
                            // 模拟 /selectUserPoster 进行分享
                            await this.getData('/updateInvition', loginInfo);
                            // 模拟 /UserSgin 用户签到
                            await this.getData('/UserSgin', loginInfo);
                            // 模拟 https://epnex.io/static/js/countryzz.json
                        }
                        catch (error) {
                            utils_2.log('模拟分享等错误, 无需关注! 错误消息:\t', error, 'error');
                        }
                        utils_2.log(`开始进行手机号验证!`);
                        let phoneData = dataHolds.validatePhone = await this.validatePhone(Object.assign({ token }, emailAndCode));
                        if (!phoneData)
                            throw new Error('注册手机号出现未知错误！可能是用户已经绑定手机号！');
                        utils_2.log(`手机号验证完成!手机号和验证码为:\t`, phoneData, '现在获取数据库句柄!');
                        let col = await mongo.getCollection('epnex', 'regists');
                        utils_2.log('数据库句柄已获取, 现在将注册信息写入数据库!');
                        let { invitation } = this;
                        let successItem = Object.assign({ user_email, user_password }, phoneData, { invitation, date: new Date().toLocaleString() });
                        col.insertOne(successItem);
                        utils_2.log('注册流程完成! 注册信息为:\t', successItem, 'warn');
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