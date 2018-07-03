import Redis from 'ioredis';
import rq from 'request';
import Chaojiying from '../../lib/chaojiying';
import { gMail } from '../../lib/mail/utils';
// import Req from '../../lib/request';

let redis = new Redis({
  host: 'chosan.cn',
  password: '199381'
});

redis.subscribe('mailReceived', (err, count) => {
  if (err) {
    throw new Error(err.message);
  } else {
    console.log(`当前第 ${count} 位订阅 mailReceived 的用户`);
  }
});

export default class Epnex {
  static baseUrl: string = 'https://epnex.io/api';
  static commonHeader: object = {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    Host: 'epnex.io',
    Origin: 'https://epnex.io',
    Referer: 'https://epnex.io/phoneSelf_sign.html?i=00VHmxY&lan=0',
    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1'
  };
  jar: any; // request cookie jar
  constructor(public invitation: string, public proxy: string = 'http://chosan.cn:12345') {}

  getData(uri: string, form: any = {}): Promise<any> {
    let { baseUrl, commonHeader: headers } = Epnex;
    let { proxy, jar } = this;
    let url = baseUrl + uri;
    return new Promise((res, rej) => {
      rq.post(url, { form, headers, proxy, jar }, (err, resp, body) => {
        if (err || resp.statusCode !== 200) {
          rej(err || resp.statusMessage);
        } else {
          res(typeof body === 'string' ? JSON.parse(body) : body);
        }
      })
    })

    // .then(data => {
    //   return typeof data === 'string' ? JSON.parse(data) : data;
    // });
  }
  async register(form: object): Promise<any> {
    if (form) {
      let { invitation } = this;
      let user_password = 'Epnexio123';
      let result = await this.getData('/Registered', JSON.stringify({ ...form, invitation, user_password }));
      if (result.errcode === 0 && result.result === 200) {
        return result;
      } else {
        throw new Error(`注册错误！错误消息:\t${JSON.stringify(result)}`);
      }
    } else {
      throw new Error('注册必要参数缺失！');
    }
  }
  async getEmailValidCode(PvilidCode: string): Promise<any> {
    if (!PvilidCode) throw new Error('获取邮件验证码函数必要参数缺失！');
    let user_email = gMail();
    let sendResult = await this.getData('/emailValidCode', JSON.stringify({ user_email, PvilidCode }));
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
        rej(`邮箱验证码发送失败!错误消息:\t${JSON.stringify(sendResult)}`);
      }
    })
  }
  async getPvilidCode(): Promise<any> {
    let { baseUrl, commonHeader: headers } = Epnex;
    let { proxy } = this;
    let jar = this.jar = rq.jar();
    let cjy = new Chaojiying('179817004', 'Mailofchaojiying*');
    let pic = rq(baseUrl + '/userValidateCode', { jar, proxy, headers });
    let codeObj = await cjy.validate(pic, '1005', '896776');
    if (codeObj && codeObj.err_no === 0 && codeObj.err_str === 'OK') {
      return codeObj.pic_str;
    } else {
      throw new Error(codeObj && codeObj.err_str || '识别图片验证码错误!');
    }
  }
  async task(): Promise<any> {
    try {
      let pvCode = await this.getPvilidCode();
      let emailAndCode = await this.getEmailValidCode(pvCode);
      let regResult = await this.register(emailAndCode);
      if (regResult.errcode === 0 && regResult.result === 200) {
        // 注册成功，进行手机验证。
      }  
    } catch (error) {
      console.error(error);
    }
  }
}
