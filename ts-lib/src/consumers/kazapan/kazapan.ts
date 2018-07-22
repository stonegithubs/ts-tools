import Redis from 'ioredis';
import rq from 'request';
import Chaojiying from '../../lib/chaojiying';
import { gMail } from '../../lib/mail/utils';
import Mongo from '../../lib/mongo';
import XunDaili, { dynamicForwardURL } from '../../lib/proxy/xundaili';
import DZ from '../../lib/SMS/dz/';
import { getRandomInt, getRandomStr, log, throwError, wait, randomUA } from '../../lib/utils';
import Requester from '../../lib/utils/declarations/requester';
import MyReq from '../../lib/request';
import { hex_md5 } from './local_lib/localLib';

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


export default class KZP implements Requester {
    requester: MyReq = new MyReq('http://www.kazapan.com', { json: false });
    constructor(public inviter) { }

    async getData(url, data?, method = 'get', params?) {
        let { requester, inviter } = this;
        let headers = {
            Host: 'www.kazapan.com',
            Referer: `http://www.kazapan.com/signup_en.html?inviter=${inviter}`,
            'X-Requested-With': 'XMLHttpRequest',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36'
        }
        let result = await requester.workFlow(url, data, method, { headers, ...params });
        try {
            return typeof result === 'string' ? JSON.parse(result) : result;
        } catch (error) {
            log('getData解析出错', error, 'error');
        }
        return result;
    }
    async getCaptcha() {
        do {
            try {
                let cap = await this.getData('/blockchain/auth/code');
                if (cap.code && cap.pngBase64) {
                    return cap.code;
                }
            } catch (error) {
                log('获取图片验证码出错', error, 'error');
            }
        } while (await wait(2000, true));
    }

    getEmailCode() {
        return new Promise(async (res, rej) => {
            // do {
            //     try {
                    let email = gMail();
                    let result = await this.getData(`/blockchain/verifyCode/sendEmail?email=${email}`);
                    if (result) {
                        redis.on('message', (channel, message) => {
                            if (channel === 'mailReceived') {
                                let msg = JSON.parse(message);
                                if (msg && msg.to.value[0].address === email) {
                                    let verifyCode = msg.html.match(/(\d+)/)[1];
                                    res({ verifyCode, email });
                                }
                            }
                        })
                    }
            //     } catch (error) {
            //         log('发送验证码失败！', error, 'error');
            //     }
            // } while (await wait(2000, true));
        })
    }

    async register(): Promise<any> {
        let { inviter: requestid } = this;
        let emailData = await this.getEmailCode();
        let originPassword = getRandomStr(15, 12);
        let password = hex_md5(originPassword);
        do {
            try {
                let data = {
                    ...emailData,
                    password,
                    requestid
                }
                let result = await this.getData('/blockchain/userInfo/register', data);           
                if (result.errorCode == 'true') {
                    return data;
                }
            } catch (error) {
                log('注册错误', error, 'error');
            }
        } while (await wait(2000, true));
    }

    async task() {
        await this.register();
        await this.getData('/userCenter_en.html');
    }
}