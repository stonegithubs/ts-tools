import Redis from 'ioredis';
import rq from 'request';
import Chaojiying from '../../lib/chaojiying';
import { gMail } from '../../lib/mail/utils';
import Mongo from '../../lib/mongo/';
import XunDaili, { dynamicForwardURL } from '../../lib/proxy/xundaili';
import DZ from '../../lib/SMS/dz/';
import { getRandomInt, getRandomStr, throwError, wait } from '../../lib/utils';

//  --------- redis ---------

const redis = new Redis({ host: 'chosan.cn', password: '199381' });

redis.subscribe('mailReceived', (err, count) => err ? throwError(err.message) : console.log(`当前第 ${count} 位订阅 mailReceived 的用户`));

//  --------- 超级鹰 ---------

const cjy = new Chaojiying('179817004', 'Mailofchaojiying*', '896776');

//  --------- DZ ---------

const dz = new DZ('zhang179817004', 'qq179817004*', '46021');

//  --------- MongoDB ---------

const xdl = new XunDaili({ orderno: 'ZF2018730302kdQRPU', secret: '944417ea359346e4ad882483cb63c13c' }); // ZF2018744533NVHTc0 ZF2018730302kdQRPU

//  --------- MongoDB ---------

const mongo = new Mongo();

//  --------- 错误枚举类型 ---------

enum ErrorType {
  WrongPvilidCode = 1,   // 验证码识别错误
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
  constructor(public invitation: string) {}

  getData(uri: string, form: any = {}): Promise<any> {
    let { baseUrl, commonHeader: headers } = Epnex;
    let { proxy, jar } = this;
    let url = baseUrl + uri;
    return new Promise((res, rej) => {
      form = typeof form === 'string' ? form : JSON.stringify(form);
      rq.post(url,  xdl.wrapParams({ form, headers, jar }), (err, resp, body) => {
        if (err || resp.statusCode !== 200) {
          rej(err || resp.statusMessage);
        } else {
          res(typeof body === 'string' ? JSON.parse(body) : body);
        }
      })
    })
  }

  // 使用邮箱和验证码注册账号
  async register(form: object): Promise<any> {
    if (form) {
      let { invitation } = this;
      let result = await this.getData('/Registered', { invitation, ...form });
      if (result.errcode === 0 && result.result === 200) {
        return result;
      } else {
        throw new Error(`注册错误！错误消息:\t${JSON.stringify(result)}`);
      }
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
        rej({ message: '邮箱验证码发送失败!', errCode: ErrorType.WrongPvilidCode, result: sendResult });
      }
    })
  }

  // 获取图片验证码, 使用超级鹰识别, 返回识别的验证码文本或抛出错误
  async getPvilidCode(): Promise<any> {
    let { baseUrl, commonHeader: headers } = Epnex;
    let { proxy } = this;
    let jar = this.jar = rq.jar();
    let params = xdl.wrapParams({ jar,  headers });
    let pic = rq(baseUrl + '/userValidateCode', params);
    // pic.on('error', e => {
    //   console.log(e);
    // })
    // pic.on('data', m => {
    //   console.log(m+'');

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
      let [ mobile ] = await dz.getMobileNums();
      let params = { mobile, areaCode: '86', ...form };
      let result = await this.getData('/mobileVerificationCode', params);
      if (result.errcode === 0 && result.result === 200) {
        let { message } = await dz.getMessageByMobile(mobile);
        let phoneCode = message.match(/(\d+)/)[1];
        let sendCodeResult = await this.getData('/bindpPhoneNumber', { phoneCode, ...params });
        if (sendCodeResult.errcode === 0 && sendCodeResult.result === 200) {
          // 注册成功
          // 模拟 /selectUserPoster 进行分享
          return { mobile };
        } else {
          console.error(sendCodeResult);
        }
      } else if (result.errcode === 0 && result.result === 1) {  // 手机号已注册
        dz.addIgnoreList(mobile);    // 手机号加黑
      }
    } while (await wait(2000, true));
  }

  async login(form?): Promise<any> {
    return this.getData('/userLogin.do', form);
  }

  async task(): Promise<any> {
    // this.getData('https://chosan.cn');
    // return;
    let dataHolds = {} as any;  // 用于记录 try 中的返回值, 在 catch 中可能用到
    do {
      try {
        let { pic_str } = dataHolds.getPvilidCode = await this.getPvilidCode();
        let emailAndCode = dataHolds.getEmailValidCode = await this.getEmailValidCode(pic_str);
        let user_password = getRandomStr(12, 8);
        let regResult = dataHolds.register = await this.register({ user_password, ...emailAndCode });
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
            await wait(getRandomInt(5, 2) * 1000 * 60);
            let phoneData = dataHolds.validatePhone = await this.validatePhone({ token, ...emailAndCode });
            let col = await mongo.getCollection('epnex', 'regists');
            let { invitation } = this;
            let successItem = { user_email, user_password, ...phoneData, invitation };
            col.insertOne(successItem);
            console.log('注册成功!', successItem);
          }
        }
        break; // 程序无异常, 跳出 while 循环
      } catch (error) {
        if (error && error.result) {
          console.log(error);
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
