import Redis from 'ioredis';
import rq from 'request';
import Chaojiying from '../../lib/chaojiying';
import { gMail } from '../../lib/mail/utils';
import Mongo from '../../lib/mongo/';
import XunDaili, { dynamicForwardURL } from '../../lib/proxy/xundaili';
import DZ from '../../lib/SMS/dz/';
import { getRandomInt, getRandomStr, log, throwError, wait } from '../../lib/utils';

//  --------- redis ---------

const redis = new Redis({ host: 'chosan.cn', password: '199381' });

redis.subscribe('mailReceived', (err, count) => err ? throwError(err.message) : log(`当前第 ${count} 位订阅 mailReceived 的用户`));

//  --------- 超级鹰 ---------

const cjy = new Chaojiying('179817004', 'Mailofchaojiying*', '896776');

//  --------- DZ ---------

const dz = new DZ('zhang179817004', 'qq179817004*', '46021');

//  --------- XunDaili ---------

const xdl = new XunDaili({ orderno: 'ZF2018730302kdQRPU', secret: '944417ea359346e4ad882483cb63c13c' }); // ZF2018744533NVHTc0 ZF2018730302kdQRPU

//  --------- MongoDB ---------

const mongo = new Mongo();

//  --------- 错误枚举类型 ---------

enum ErrorType {
  WrongPvilidCode = 1,   // 验证码识别错误
}

enum ErrorValidatePhone{
  PhoneUsed = 1,  // 手机号已注册
  TokenExpire,  // token 错误或过期
  HasBindPhone,  // 邮箱已绑定手机号
  OK = 200
}

//  --------- Epnex ---------

export default class Epnex {
  static baseUrl: string = 'https://epnex.io/api';
  static commonHeader: object = {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    Host: 'epnex.io',
    Origin: 'https://epnex.io',
    Referer: 'https://epnex.io/phoneSelf_sign.html?i=00TPBBT&lan=0',
    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1'
  };
  jar: any; // request cookie jar
  proxy: string = dynamicForwardURL;
  user_email: string;
  user_password: string = getRandomStr(12, 8);
  token: any;
  loginInfo: any;
  constructor(public invitation: string) {}

  getData(uri: string, form: any = {}, method = 'post'): Promise<any> {
    let { baseUrl, commonHeader: headers } = Epnex;
    let { jar } = this;
    let url = uri.indexOf('http') ?  baseUrl + uri : uri;
    return new Promise((res, rej) => {
      form = typeof form === 'string' ? form : JSON.stringify(form);
      rq[method](url, xdl.wrapParams({ form, headers, jar }), (err, resp, body) => {
        if (err || (resp && resp.statusCode !== 200)) {
          log(err, resp && resp.statusCode, body, 'error');
          rej(err || resp.statusMessage);
        } else {
          try {
            res(typeof body === 'string' ? JSON.parse(body) : body);
          } catch (error) {
            log('getData解析错误', error, 'error');
            res(body);
          }
        }
      })
    })
  }

  // 使用邮箱和验证码注册账号
  async register(form: object): Promise<any> {
    if (form) {
      let { invitation } = this;
      do {
        let result = await this.getData('/Registered', { invitation, ...form });
        if (result.errcode === 0 && result.result === 200) {
          return result;
        } else if (result.errcode === 0 && result.result === 4) {  // 验证码不正确，抛出错误，重新获取验证码和邮箱
          throw new Error(`注册错误！错误消息:\t${JSON.stringify(result)}`);
        }
      } while (await wait(2000, true));
    } else {
      throw new Error('注册必要参数缺失！');
    }
  }

  // 使用识别得到的图片验证码发送邮件, 获取邮箱验证码
  async getEmailValidCode(PvilidCode: string): Promise<any> {
    if (!PvilidCode) throw new Error('获取邮件验证码函数必要参数缺失！');
    let user_email = gMail();
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
      } else {
        rej({ message: '邮箱验证码发送失败!', errCode: ErrorType.WrongPvilidCode, result: { ...sendResult, date: new Date().toLocaleString() } });
      }
    })
  }

  // 获取图片验证码, 使用超级鹰识别, 返回识别的验证码文本或抛出错误
  async getPvilidCode(): Promise<any> {
    let { baseUrl, commonHeader: headers } = Epnex;
    let jar = this.jar = rq.jar();
    let params = xdl.wrapParams({ jar,  headers });
    let pic = rq(baseUrl + '/userValidateCode', params);
    // pic.on('error', e => {
    //   log(e, 'error');
    // })
    // pic.on('data', m => {
    //   log(m+'');
    // })
    let codeObj = await cjy.validate(pic, '1005');
    if (codeObj && codeObj.err_no === 0 && codeObj.err_str === 'OK') {
      return codeObj;
    } else {
      throw new Error(codeObj && codeObj.err_str || '识别图片验证码错误!');
    }
  }

  // 验证手机号
  async validatePhone(form?): Promise<any> {
    do {
      try {
        let [ mobile ] = await dz.getMobileNums();
        doValidateBegin: {
          do{
            let params = { mobile, areaCode: '86', ...form, ...this.loginInfo };
            try {
              
              let result = await this.getData('/mobileVerificationCode', params);
              if (result.errcode === 0) {
                switch (result.result) {
                  case ErrorValidatePhone.PhoneUsed:
                    dz.addIgnoreList(mobile);    // 手机号加黑, 不再获取该手机号
                    break doValidateBegin;
                  case ErrorValidatePhone.TokenExpire:  // token 过期
                  // 重新登录获取 token
                    await this.login();
                    continue;
                  case ErrorValidatePhone.HasBindPhone:  // 邮箱已绑定手机号
                    log(result, 'error');
                    return;
                  case ErrorValidatePhone.OK:  // 成功
                    log('短信发送成功！');
                    let { message } = await dz.getMessageByMobile(mobile);
                    if (message) {
                      let phoneCode = message.match(/(\d+)/)[1];
                      let sendCodeResult = await this.getData('/bindpPhoneNumber', { phoneCode, ...params });
                      if (sendCodeResult.errcode === 0 && sendCodeResult.result === 200) {
                        // 注册成功
                        return { mobile };
                      } else {
                        log(sendCodeResult, 'error');
                        break; // 避免 switch 隐式贯穿
                      }
                    } else {
                      // 手机接收验证码失败，可能是因为手机号已经被 DZ 释放
                      log('手机接收验证码失败，可能是因为手机号已经被 DZ 释放', 'error');
                      break doValidateBegin;
                    }
                  default:
                    break;
                }
              }
            } catch (error) {
              log('获取手机验证码失败:\t', error, 'error');
            }
          } while(await wait(2000, true));
        }
      } catch (error) {
          log('获取手机号失败:\t', error, 'error');
      }
    } while (await wait(2000, true));
  }

  async login(user_email = this.user_email, user_password = this.user_password): Promise<any> {
    // 邮箱和密码 100 % 正确, 因此此处可以使用 while 保证不会因为网络错误导致登录失败;
    do {
      try {
        let loginResult = await this.getData('/userLogin.do', { user_email, user_password });
        if (loginResult && loginResult.result === 200) {
          this.loginInfo = JSON.parse(loginResult.data)[0];
          this.token = this.loginInfo.token;
          return loginResult;
        }
      } catch (error) {
          log('登录错误! 错误信息:\t', error, 'error');
      }
    } while (await wait(2000, true));
  }

  async mockOperation (): Promise<any> {
    // 以下为模拟用户操作, 不关心是否成功!
    let { loginInfo, loginInfo: { user_email }} = this;
    try {
      // 模拟 /UserSgin 用户签到
      await this.getData('/UserSgin', loginInfo);
      log('签到完成');
      // 模拟 /Initial
      await this.getData('/Initial', loginInfo);
      log('Initial完成');
      // 模拟 /updateInvition
      await this.getData('/updateInvition', loginInfo);
      log('updateInvition完成');
      // 模拟 https://epnex.io/static/js/countryzz.json
      // 模拟 /selectUserPoster 进行分享
      // 模拟获取分享海报 http://jxs-epn.oss-cn-hongkong.aliyuncs.com/epn/img/179817004@qq.com01C.png
      // http://jxs-epn.oss-cn-hongkong.aliyuncs.com/epn/img/rWviQ2TI5e@mln.kim01E.png
      let sharePngInfo = await this.getData('/selectUserPoster', loginInfo);
      log('selectUserPoster完成', sharePngInfo, '即将进行获取分享图片');
      let pngs = JSON.parse(sharePngInfo.data)[0];
      try {
        await this.getData('https://epnex.io/phoneSelf_share.html?lan=0', {}, 'get');
        await this.getData(pngs.Cuser_headPortrait1, {}, 'get');
      } catch (error) {
        log('C用户分享错误', user_email, error, 'error');
      }
      try {
        await this.getData('https://epnex.io/phoneSelf_share.html?lan=1', {}, 'get');
        await this.getData(pngs.Euser_headPortrait1, {}, 'get');
      } catch (error) {
        log('E用户分享错误', user_email, error, 'error');
      }
    } catch (error) {
      log('模拟分享等错误, 无需关注! 错误消息:\t', error, 'error');
    }
    log('模拟操作完成！');
  } 

  async task(): Promise<any> {
    let dataHolds = {} as any;  // 用于记录 try 中的返回值, 在 catch 中可能用到
    let roundTrip = 0;
    let { invitation } = this;
    do {
      try {
        log(`第\t${++roundTrip}\t次开始，进行图片识别！`);
        let { pic_str } = dataHolds.getPvilidCode = await this.getPvilidCode();
        log('图片验证码已获取! 验证码:\t', pic_str, '\t即将开始获取邮箱验证码!');
        let emailAndCode = dataHolds.getEmailValidCode = await this.getEmailValidCode(pic_str);
        log('邮箱验证码已获取! 验证码:\t', emailAndCode, '\t即将注册!');
        let { user_password } = this;
        let regResult = dataHolds.register = await this.register({ user_password, ...emailAndCode });
        if (regResult.errcode === 0 && regResult.result === 200) {
          // 注册成功, 执行登陆
          log('注册已完成! 注册结果:\t', regResult, '\t即将登陆!');
          let { user_email } = emailAndCode;
          this.user_email = user_email;
          this.user_password = user_password;
          let colNotValidatePhone = await mongo.getCollection('epnex', 'notValidate');  // 写入已注册未认证数据, 如果认证完成, 则删除.
          await colNotValidatePhone.insertOne({ user_password, user_email, invitation });
          let loginData = dataHolds.login = await this.login();
          // 进行手机验证。
          let waitTimt = getRandomInt(5, 2) as number;
          log(`登陆成功! 等待 ${waitTimt} 分钟后进行手机号验证!`);
          await wait(waitTimt * 1000 * 60);
          log(`开始进行手机号验证!`);
          let phoneData = dataHolds.validatePhone = await this.validatePhone();
          if (!phoneData) throw new Error('注册手机号出现未知错误！可能是用户已经绑定手机号！');
          log(`手机号验证完成!手机号和验证码为:\t`, phoneData, '将未认证手机号的记录从未认证数据库集合中删除');
          await colNotValidatePhone.deleteOne({ user_email });
          log('现在获取数据库句柄!')
          let col = await mongo.getCollection('epnex', 'regists');
          log('数据库句柄已获取, 现在将注册信息写入数据库!');
          let successItem = { user_email, user_password, ...phoneData, invitation, date: new Date().toLocaleString() };
          col.insertOne(successItem);
          log('注册流程完成! 注册信息为:\t', successItem, 'warn');
        }
        break; // 程序无异常, 跳出 while 循环
      } catch (error) {
        log(error, 'error');
        if (error && error.result) {
          switch (error.errCode) {
            case ErrorType.WrongPvilidCode:   // 验证码识别错误, 将错误反馈给超级鹰
            cjy.reportError(dataHolds.getPvilidCode.pic_id);
              break;
            default:
              break;
          }
        }
      }
    } while (await wait(1000, true));
  }
}
