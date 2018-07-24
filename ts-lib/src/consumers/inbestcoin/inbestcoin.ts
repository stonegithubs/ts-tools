import Redis from 'ioredis';
import rq from 'request';
import Chaojiying from '../../lib/chaojiying';
import { gMail } from '../../lib/mail/utils';
import Mongo from '../../lib/mongo/';
import XunDaili, { dynamicForwardURL } from '../../lib/proxy/xundaili';
import DZ from '../../lib/SMS/dz/';
import { getRandomInt, getRandomStr, log, throwError, wait, randomUA } from '../../lib/utils';
import Requester from '../../lib/utils/declarations/requester';
import MyReq from '../../lib/request';
import { inbest_md5 } from './statics/md5';

//  --------- redis ---------

const redis = new Redis({ host: 'mlo.kim', password: '199381' });

redis.subscribe('mailReceived', (err, count) => err ? throwError(err.message) : log(`当前第 ${count} 位订阅 mailReceived 的用户`));

//  --------- 超级鹰 ---------

const cjy = new Chaojiying('179817004', 'Mailofchaojiying*', '896776');

//  --------- DZ ---------

const dz = new DZ('zhang179817004', 'qq179817004*', '46021');

//  --------- XunDaili ---------

const xdl = new XunDaili({ orderno: 'ZF20187249103GcJiAA', secret: 'f7691def90804df3ba830c1a1308a718' }); // ZF2018744533NVHTc0 ZF20187249103GcJiAA

//  --------- MongoDB ---------

const mongo = new Mongo();


export default class INBEST implements Requester {
    baseURL = 'http://www.inbestcoin.com';
    requester: MyReq = new MyReq('http://www.inbestcoin.com', { json: false });
    headers = {
        Host: 'www.inbestcoin.com',
        Referer: `http://www.inbestcoin.com/regcode/${this.referralCode}`,
        'User-Agent': randomUA()
    }
    jar = rq.jar();
    constructor(public referralCode) { }

    async getData(url, data?, method = 'get', params?) {
        let { requester, headers } = this;
        let oParams = {
            headers,
            ...params
        }
        return requester.workFlow(url, data, method, xdl.wrapParams(oParams));
    }

    async getPvilidCode(): Promise<any> {
        let { jar, baseURL, headers } = this;
        let params = xdl.wrapParams(
            { jar, headers }
        );
        let url = 'http://www.inbestcoin.com/sms/registcode.jpg';
        let pic = rq(url, params);
        pic.on('error', e => {
          log(e, 'error');
        })
        pic.on('data', m => {
          log(m+'');
        })
        let codeObj = await cjy.validate(pic, '6001');
        if (codeObj && codeObj.err_no === 0 && codeObj.err_str === 'OK') {
            return codeObj;
        } else {
            throw new Error(codeObj && codeObj.err_str || '识别图片验证码错误!');
        }
    }

    async getHTML() {
        return this.getData(`/regcode/${this.referralCode}`);
    }

    async register() {
        do {
            try {
                await this.getHTML();
                let { pic_str: registCode } = await this.getPvilidCode();
                let originPassword = getRandomStr(15, 12);
                let password = inbest_md5(originPassword);
                let email = gMail();
                let { referralCode } = this;
                let params =  {
                    password, registCode, email, referralCode
                };
                let result = await this.getData('/registService', params, 'post');
                if (result) {
                    let col = await mongo.getCollection('inbest', 'regists');
                    col.insertOne(params);;
                    break;
                }
            } catch (error) {
                log('注册发生错误！', error, 'error');
            }

        } while (await wait(2000, true));
    }
}


redis.on('message', async (channel, message) => {
    if (channel === 'mailReceived') {
        let msg = JSON.parse(message);
        let address = msg && msg.to.value[0].address;
        if (msg) {
            let validUrl: string = msg.html.match(/http:\/\/[^\s]+/)[0];
            let result = await MyReq.getData(validUrl);
            log(result);
        }
    }
});