import Redis from 'ioredis';
import rq from 'request';
import rp from 'request-promise';
import Chaojiying from '../../lib/chaojiying';
import { gMail } from '../../lib/mail/utils';
// import Req from '../../lib/request';

let redis = new Redis({
  host: 'chosan.cn',
  password: '199381'
});

export default class Epnex {
  static baseUrl: string = 'https://epnex.io/api';
  static commonHeader: object = {
    Host: 'epnex.io',
    Origin: 'https://epnex.io',
    Referer: 'https://epnex.io/phoneSelf_sign.html?i=00VHmxY&lan=0',
    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1'
  };
  jar: any; // request cookie jar
  constructor(public proxy: string = 'http://chosan.cn:12345') {
    redis.subscribe('mailReceived', (err, count) => {
      if (err) {
        throw new Error(err.message);
      } else {
        console.log(`当前第 ${count} 位订阅 mailReceived 的用户`);
      }
    });
  }
  register(): boolean {
    return false;
  }
  getData(uri: string, body: any = {}): Promise<any> {
    let { baseUrl, commonHeader: headers } = Epnex;
    let { proxy, jar } = this;
    // let rjar = Req.jar();
    // rjar.setCookie('')
    let url = baseUrl + uri;
    return rp.post(url, { form: body, headers, proxy, jar });
  }
  async getEmailValidCode(PvilidCode: string): Promise<any> {
    let user_email = gMail();
    let sendResult = await this.getData('/emailValidCode', JSON.stringify({ user_email, PvilidCode }));
    if (sendResult.errcode === 0 && sendResult.result === 200) {
      redis.on('message', (channel, message) => {
        if (channel === 'mailReceived') {
          let msg = JSON.parse(message);
          if (msg) {
            //
          }
        }
      });
    } else {
      throw new Error('邮箱验证码发送失败!');
    }
  }
  async getPvilidCode(): Promise<any> {
    let { baseUrl, commonHeader: headers } = Epnex;
    let { proxy } = this;
    let jar = this.jar = rq.jar();
    let cjy = new Chaojiying('179817004', 'Mailofchaojiying*');
    let pic = rq(baseUrl + '/userValidateCode', { jar, proxy, headers });
    let code = await cjy.validate(pic, '1005', '896776').then(data => {
      if (data.err_no === 0 && data.err_str === 'OK') {
        return data.pic_str;
      } else {
        throw new Error(data.err_str);
      }
    });

    return code;
  }
  async task(): Promise<any> {
    let pvCode = await this.getPvilidCode();
    // let emailCode =
    await this.getEmailValidCode(pvCode);
  }
}
