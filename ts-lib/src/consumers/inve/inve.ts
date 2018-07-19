import Redis from 'ioredis';
import rq from 'request';
import Chaojiying from '../../lib/chaojiying';
import { gMail } from '../../lib/mail/utils';
import Mongo from '../../lib/mongo/';
import XunDaili, { dynamicForwardURL } from '../../lib/proxy/xundaili';
import DZ from '../../lib/SMS/dz/';
import { getRandomInt, getRandomStr, log, throwError, wait, check } from '../../lib/utils';

//  --------- redis ---------

const redis = new Redis({ host: 'chosan.cn', password: '199381' });

redis.subscribe('mailReceived', (err, count) => err ? throwError(err.message) : log(`当前第 ${count} 位订阅 mailReceived 的用户`));

//  --------- 超级鹰 ---------

const cjy = new Chaojiying('179817004', 'Mailofchaojiying*', '896776');

//  --------- DZ ---------

const dz = new DZ('zhang179817004', 'qq179817004*', '48930');

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

//  --------- INVE ---------

export default class INVE {
  static baseUrl: string = 'https://www.inve.one/air';
  static commonHeader: object = {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    Host: 'www.inve.one',
    Pragma: 'no-cache',
    Origin: 'https://www.inve.one',
    Referer: 'https://www.inve.one/air/inviteCn?userId=VGtSQk1VNXFRVDA9',
    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1'
  };
  jar: any; // request cookie jar
  proxy: string = dynamicForwardURL;

  constructor(public inviteCode: string) {}

  getData(uri: string, form: any = {}, method = 'post'): Promise<any> {
    let { baseUrl, commonHeader: headers } = INVE;
    let { jar } = this;
    let url = uri.indexOf('http') ?  baseUrl + uri : uri;
    return new Promise((res, rej) => {
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

  async queryUserByPhone(phone): Promise<any> {
    do {
      try {
        let result = await this.getData('/air/user/queryUserByPhone', { phone: `86${phone}` });
        if (result.code === 200 && result.msg === '手机未注册') {
          return true;
        } else {
          return false;
        }
      } catch (error) {
        log('验证手机出错!', error, 'error');
      }
    } while (await wait(2000, true));
  }

  async queryUserByEmail(): Promise<any> {
    do {
      let email = gMail();
      try {
        let checkResult = await this.getData('/air/user/queryUserByEmail', { email });
        if (checkResult.code === 200 && checkResult.msg === '邮箱未注册') {
          return email;
        }
      } catch (error) {
        log(error, 'error');
      }
    } while (await wait(2000, true));
  }

  // 使用邮箱和验证码注册账号
  async register(form: object): Promise<any> {
    if (form) {
      let { inviteCode: userId } = this;
      do {
        try {
          let result = await this.getData('/air/user/registerCn', { userId, ...form });
          if (result.code === 200) {
            // 注册成功
            return result;
          } else if (result.code === 1000) {  // 验证码不正确，抛出错误，重新获取验证码和邮箱
            throw new Error(`注册错误！错误消息:\t${JSON.stringify(result)}`);
          }
        } catch (error) {
          log('注册错误!', error, 'error');
        }
      } while (await wait(2000, true));
    } else {
      throw new Error('注册必要参数缺失！');
    }
  }

  // 获取图片验证码, 使用超级鹰识别, 返回识别的验证码文本或抛出错误
  async getPvilidCode(): Promise<any> {
    let { baseUrl, commonHeader: headers } = INVE;
    let jar = this.jar = rq.jar();
    let params = xdl.wrapParams({ jar,  headers });
    do {
      try {
        let pic = rq(baseUrl + '/captcha.jpg', params);
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
      } catch (error) {
        log(error, 'error');
      }
    } while (await wait(2000, true));
  }

  async getPhoneCode(form: { code, phone }) {
    do {
      try {
        let result = await this.getData('/air/user/queryCode', { ...form, phonenum: 86 });
        if (result.code === 200 && result.tag) {
          return result.tag;
        } else if (result.code === 1000 && result.msg === '图形验证码验证失败') {
          return false;
        }
      } catch (error) {
        log(error, 'error');
      }
    } while (await wait(2000, true));
  }

  // 验证手机号
  async validatePhone(): Promise<any> {
    do {
      // 获取手机号
      let [ phone ] = ['17765678987'] && await dz.getMobileNums();
      validatePic: {
        do {
          // 获取图片验证码
          let { pic_id, pic_str: code } = await this.getPvilidCode();
          if (await this.queryUserByPhone(phone)) { // 检测手机号是否注册
            // 手机号未注册
            let captcha;
            if (captcha = await this.getPhoneCode({ code, phone })) { // 获取手机验证码
              // 发送验证码成功
              let { message } = await dz.getMessageByMobile(phone);  // 获取短信消息
              if (message) {
                let yzmCode = message.match(/验证码(\d+)，/)[1];  // 匹配验证码
                let email = await this.queryUserByEmail();  // 验证邮箱
                let originPassword = getRandomStr(14, 12);
                let password = hex_md5(originPassword);   // 加密密码
                let params = { userId: this.inviteCode, phoneNum: 86, phone, code: yzmCode, email, password, captcha }
                let regResult = await this.register(params);
                if (regResult) {
                  return { ...params, originPassword };
                }
              }
            } else {
              cjy.reportError(pic_id);
              break; // 验证码验证失败, 重新获取图片验证
            }
          } else {
            dz.addIgnoreList(phone);    // 手机号加黑, 不再获取该手机号
            break validatePic;
          }
        } while (await wait(2000, true));
      }
    } while (await wait(2000, true));
  }

  async login(username, password) {
    await this.getData('/air/user/login', { email: username, password });
  }

  async mock() {
    try {
      log('开始自动登录跳转!');
      await this.getData('/sys/percenter_cn.html', {}, 'get');
      log('完成自动登录跳转! 开始获取邀请列表!');
      await this.getData('/air/icode/list', { page: 1, limit: 10 });
      log('完成邀请列表获取, 开始获取用户信息!');
      await this.getData('/air/user/info/', {});
      log('完成获取用户信息, 开始获取userListCn!');
      await this.getData('/air/user/userListCn', {});
      log('完成获取userListCn, 模拟结束');
    } catch (error) {
      log(error, 'error');
    }
  }

  async task(task_id): Promise<any> {
    log(`${task_id}开始!`);
    let data = await this.validatePhone();
    let col = await mongo.getCollection('inve', 'regists');
    log(`${task_id}完成!`);
    col.insertOne(data);
    await this.mock();
  }
}

// 从网站摘录
function hex_md5(s){
  var chrsz = 8;
  var hexcase = 0;
  function safe_add (x, y) {
    var lsw = (x & 0xFFFF) + (y & 0xFFFF);
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xFFFF);
  }
  function S (X, n) { return ( X >>> n ) | (X << (32 - n)); }
  function R (X, n) { return ( X >>> n ); }
  function Ch(x, y, z) { return ((x & y) ^ ((~x) & z)); }
  function Maj(x, y, z) { return ((x & y) ^ (x & z) ^ (y & z)); }
  function Sigma0256(x) { return (S(x, 2) ^ S(x, 13) ^ S(x, 22)); }
  function Sigma1256(x) { return (S(x, 6) ^ S(x, 11) ^ S(x, 25)); }
  function Gamma0256(x) { return (S(x, 7) ^ S(x, 18) ^ R(x, 3)); }
  function Gamma1256(x) { return (S(x, 17) ^ S(x, 19) ^ R(x, 10)); }
  function core_sha256 (m, l) {
    var K = new Array(0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5, 0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3, 0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174, 0xE49B69C1, 0xEFBE4786, 0xFC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA, 0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3, 0xD5A79147, 0x6CA6351, 0x14292967, 0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13, 0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85, 0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3, 0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070, 0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3, 0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208, 0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2);
    var HASH = new Array(0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19);
    var W = new Array(64);
    var a, b, c, d, e, f, g, h, i, j;
    var T1, T2;
    m[l >> 5] |= 0x80 << (24 - l % 32);
    m[((l + 64 >> 9) << 4) + 15] = l;
    for ( var i:any = 0; i<m.length; i+=16 ) {
      a = HASH[0];
      b = HASH[1];
      c = HASH[2];
      d = HASH[3];
      e = HASH[4];
      f = HASH[5];
      g = HASH[6];
      h = HASH[7];
      for ( var j:any = 0; j<64; j++) {
        if (j < 16) W[j] = m[j + i];
        else W[j] = safe_add(safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j - 16]);
        T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);
        T2 = safe_add(Sigma0256(a), Maj(a, b, c));
        h = g;
        g = f;
        f = e;
        e = safe_add(d, T1);
        d = c;
        c = b;
        b = a;
        a = safe_add(T1, T2);
      }
      HASH[0] = safe_add(a, HASH[0]);
      HASH[1] = safe_add(b, HASH[1]);
      HASH[2] = safe_add(c, HASH[2]);
      HASH[3] = safe_add(d, HASH[3]);
      HASH[4] = safe_add(e, HASH[4]);
      HASH[5] = safe_add(f, HASH[5]);
      HASH[6] = safe_add(g, HASH[6]);
      HASH[7] = safe_add(h, HASH[7]);
    }
    return HASH;
  }
  function str2binb (str) {
    var bin = Array();
    var mask = (1 << chrsz) - 1;
    for(var i = 0; i < str.length * chrsz; i += chrsz) {
      bin[i>>5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i%32);
    }
    return bin;
  }
  function Utf8Encode(string) {
    string = string.replace(/\r\n/g,"\n");
    var utftext = "";
    for (var n = 0; n < string.length; n++) {
      var c = string.charCodeAt(n);
      if (c < 128) {
        utftext += String.fromCharCode(c);
      }
      else if((c > 127) && (c < 2048)) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      }
      else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }
    }
    return utftext;
  }
  function binb2hex (binarray) {
    var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
    var str = "";
    for(var i = 0; i < binarray.length * 4; i++) {
      str += hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8+4)) & 0xF) +
      hex_tab.charAt((binarray[i>>2] >> ((3 - i%4)*8 )) & 0xF);
    }
    return str;
  }
  s = Utf8Encode(s);
  return binb2hex(core_sha256(str2binb(s), s.length * chrsz));
}