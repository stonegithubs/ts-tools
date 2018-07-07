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
//  --------- XunDaili ---------
const xdl = new xundaili_1.default({ orderno: 'ZF2018730302kdQRPU', secret: '944417ea359346e4ad882483cb63c13c' }); // ZF2018744533NVHTc0 ZF2018730302kdQRPU
//  --------- MongoDB ---------
const mongo = new mongo_1.default();
//  --------- 错误枚举类型 ---------
var ErrorType;
(function (ErrorType) {
    ErrorType[ErrorType["WrongPvilidCode"] = 1] = "WrongPvilidCode";
})(ErrorType || (ErrorType = {}));
var ErrorValidatePhone;
(function (ErrorValidatePhone) {
    ErrorValidatePhone[ErrorValidatePhone["PhoneUsed"] = 1] = "PhoneUsed";
    ErrorValidatePhone[ErrorValidatePhone["TokenExpire"] = 2] = "TokenExpire";
    ErrorValidatePhone[ErrorValidatePhone["HasBindPhone"] = 3] = "HasBindPhone";
    ErrorValidatePhone[ErrorValidatePhone["OK"] = 200] = "OK";
})(ErrorValidatePhone || (ErrorValidatePhone = {}));
//  --------- Epnex ---------
class Epnex {
    constructor(invitation) {
        this.invitation = invitation;
        this.proxy = xundaili_1.dynamicForwardURL;
        this.user_password = utils_2.getRandomStr(12, 8);
    }
    getData(uri, form = {}, method = 'post') {
        let { baseUrl, commonHeader: headers } = Epnex;
        let { jar } = this;
        let url = baseUrl + uri;
        return new Promise((res, rej) => {
            form = typeof form === 'string' ? form : JSON.stringify(form);
            request_1.default[method](url, xdl.wrapParams({ form, headers, jar }), (err, resp, body) => {
                if (err || (resp && resp.statusCode !== 200)) {
                    utils_2.log(err, resp && resp.statusCode, body, 'error');
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
                doValidateBegin: {
                    do {
                        let params = Object.assign({ mobile, areaCode: '86' }, form, this.loginInfo);
                        try {
                            let result = await this.getData('/mobileVerificationCode', params);
                            if (result.errcode === 0) {
                                switch (result.result) {
                                    case ErrorValidatePhone.PhoneUsed:
                                        dz.addIgnoreList(mobile); // 手机号加黑, 不再获取该手机号
                                        break doValidateBegin;
                                    case ErrorValidatePhone.TokenExpire: // token 过期
                                        // 重新登录获取 token
                                        await this.login();
                                        continue;
                                    case ErrorValidatePhone.HasBindPhone: // 邮箱已绑定手机号
                                        utils_2.log(result, 'error');
                                        return;
                                    case ErrorValidatePhone.OK: // 成功
                                        utils_2.log('短信发送成功！');
                                        let { message } = await dz.getMessageByMobile(mobile);
                                        if (message) {
                                            let phoneCode = message.match(/(\d+)/)[1];
                                            let sendCodeResult = await this.getData('/bindpPhoneNumber', Object.assign({ phoneCode }, params));
                                            if (sendCodeResult.errcode === 0 && sendCodeResult.result === 200) {
                                                // 注册成功
                                                return { mobile };
                                            }
                                            else {
                                                utils_2.log(sendCodeResult, 'error');
                                                break; // 避免 switch 隐式贯穿
                                            }
                                        }
                                        else {
                                            // 手机接收验证码失败，可能是因为手机号已经被 DZ 释放
                                            utils_2.log('手机接收验证码失败，可能是因为手机号已经被 DZ 释放', 'error');
                                            break doValidateBegin;
                                        }
                                    default:
                                        break;
                                }
                            }
                        }
                        catch (error) {
                            utils_2.log('获取手机验证码失败:\t', error, 'error');
                        }
                    } while (await utils_2.wait(2000, true));
                }
            }
            catch (error) {
                utils_2.log('获取手机号失败:\t', error, 'error');
            }
        } while (await utils_2.wait(2000, true));
    }
    async login(user_email = this.user_email, user_password = this.user_password) {
        // 邮箱和密码 100 % 正确, 因此此处可以使用 while 保证不会因为网络错误导致登录失败;
        do {
            try {
                let loginResult = await this.getData('/userLogin.do', { user_email, user_password });
                if (loginResult && loginResult.result === 200) {
                    this.loginInfo = JSON.parse(loginResult.data)[0];
                    this.token = this.loginInfo.token;
                    return loginResult;
                }
            }
            catch (error) {
                utils_2.log('登录错误! 错误信息:\t', error, 'error');
            }
        } while (await utils_2.wait(2000, true));
    }
    async mockOperation() {
        // 以下为模拟用户操作, 不关心是否成功!
        let { loginInfo, loginInfo: { user_email } } = this;
        try {
            // 模拟 /UserSgin 用户签到
            await this.getData('/UserSgin', loginInfo);
            utils_2.log('签到完成');
            // 模拟 /Initial
            await this.getData('/Initial', loginInfo);
            utils_2.log('Initial完成');
            // 模拟 /updateInvition
            await this.getData('/updateInvition', loginInfo);
            utils_2.log('updateInvition完成');
            // 模拟 https://epnex.io/static/js/countryzz.json
            // 模拟 /selectUserPoster 进行分享
            // 模拟获取分享海报 http://jxs-epn.oss-cn-hongkong.aliyuncs.com/epn/img/179817004@qq.com01C.png
            // http://jxs-epn.oss-cn-hongkong.aliyuncs.com/epn/img/rWviQ2TI5e@mln.kim01E.png
            let sharePngInfo = await this.getData('/selectUserPoster', loginInfo);
            let pngs = JSON.parse(sharePngInfo.data)[0];
            try {
                await this.getData(pngs.Cuser_headPortrait1, {}, 'get');
            }
            catch (error) {
                utils_2.log('C用户分享错误', user_email, error, 'error');
            }
            try {
                await this.getData(pngs.Euser_headPortrait1, {}, 'get');
            }
            catch (error) {
                utils_2.log('E用户分享错误', user_email, error, 'error');
            }
        }
        catch (error) {
            utils_2.log('模拟分享等错误, 无需关注! 错误消息:\t', error, 'error');
        }
        utils_2.log('模拟操作完成！');
    }
    async task() {
        let dataHolds = {}; // 用于记录 try 中的返回值, 在 catch 中可能用到
        let roundTrip = 0;
        let { invitation } = this;
        do {
            try {
                utils_2.log(`第\t${++roundTrip}\t次开始，进行图片识别！`);
                let { pic_str } = dataHolds.getPvilidCode = await this.getPvilidCode();
                utils_2.log('图片验证码已获取! 验证码:\t', pic_str, '\t即将开始获取邮箱验证码!');
                let emailAndCode = dataHolds.getEmailValidCode = await this.getEmailValidCode(pic_str);
                utils_2.log('邮箱验证码已获取! 验证码:\t', emailAndCode, '\t即将注册!');
                let { user_password } = this;
                let regResult = dataHolds.register = await this.register(Object.assign({ user_password }, emailAndCode));
                if (regResult.errcode === 0 && regResult.result === 200) {
                    // 注册成功, 执行登陆
                    utils_2.log('注册已完成! 注册结果:\t', regResult, '\t即将登陆!');
                    let { user_email } = emailAndCode;
                    this.user_email = user_email;
                    this.user_password = user_password;
                    let colNotValidatePhone = await mongo.getCollection('epnex', 'notValidate'); // 写入已注册未认证数据, 如果认证完成, 则删除.
                    await colNotValidatePhone.insertOne({ user_password, user_email, invitation });
                    let loginData = dataHolds.login = await this.login();
                    // 进行手机验证。
                    let waitTimt = utils_2.getRandomInt(5, 2);
                    utils_2.log(`登陆成功! 等待 ${waitTimt} 分钟后进行手机号验证!`);
                    await utils_2.wait(waitTimt * 1000 * 60);
                    utils_2.log(`开始进行手机号验证!`);
                    let phoneData = dataHolds.validatePhone = await this.validatePhone();
                    if (!phoneData)
                        throw new Error('注册手机号出现未知错误！可能是用户已经绑定手机号！');
                    utils_2.log(`手机号验证完成!手机号和验证码为:\t`, phoneData, '将未认证手机号的记录从未认证数据库集合中删除');
                    await colNotValidatePhone.deleteOne({ user_email });
                    utils_2.log('现在获取数据库句柄!');
                    let col = await mongo.getCollection('epnex', 'regists');
                    utils_2.log('数据库句柄已获取, 现在将注册信息写入数据库!');
                    let successItem = Object.assign({ user_email, user_password }, phoneData, { invitation, date: new Date().toLocaleString() });
                    col.insertOne(successItem);
                    utils_2.log('注册流程完成! 注册信息为:\t', successItem, 'warn');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXBuZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29uc3VtZXJzL2VwbmV4L2VwbmV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLHNEQUE0QjtBQUM1QixzREFBeUI7QUFDekIsc0VBQThDO0FBQzlDLGdEQUE2QztBQUM3Qyw2REFBcUM7QUFDckMscUVBQXVFO0FBQ3ZFLDJEQUFtQztBQUNuQywyQ0FBb0Y7QUFFcEYsNkJBQTZCO0FBRTdCLE1BQU0sS0FBSyxHQUFHLElBQUksaUJBQUssQ0FBQyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUM7QUFFbkUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLGtCQUFVLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFHLENBQUMsT0FBTyxLQUFLLHVCQUF1QixDQUFDLENBQUMsQ0FBQztBQUUxSCwyQkFBMkI7QUFFM0IsTUFBTSxHQUFHLEdBQUcsSUFBSSxvQkFBVSxDQUFDLFdBQVcsRUFBRSxtQkFBbUIsRUFBRSxRQUFRLENBQUMsQ0FBQztBQUV2RSwwQkFBMEI7QUFFMUIsTUFBTSxFQUFFLEdBQUcsSUFBSSxZQUFFLENBQUMsZ0JBQWdCLEVBQUUsY0FBYyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBRTdELGdDQUFnQztBQUVoQyxNQUFNLEdBQUcsR0FBRyxJQUFJLGtCQUFRLENBQUMsRUFBRSxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxFQUFFLGtDQUFrQyxFQUFFLENBQUMsQ0FBQyxDQUFDLHdDQUF3QztBQUVqSiwrQkFBK0I7QUFFL0IsTUFBTSxLQUFLLEdBQUcsSUFBSSxlQUFLLEVBQUUsQ0FBQztBQUUxQiw4QkFBOEI7QUFFOUIsSUFBSyxTQUVK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