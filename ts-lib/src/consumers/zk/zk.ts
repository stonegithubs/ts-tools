// 2018年7月8日23:37:17

import Mongo from '../../lib/mongo/';
import XunDaili from '../../lib/proxy/xundaili';
import MyReq from '../../lib/request';
import DZ from '../../lib/SMS/dz/';
import { getRandomInt, getRandomStr, log, throwError, wait } from '../../lib/utils';
import Requester from '../../lib/utils/declarations/requester';

//  --------- DZ ---------

const dz = new DZ('zhang179817004', 'qq179817004*', '48108');

//  --------- XunDaili ---------

const xdl = new XunDaili({ orderno: 'ZF2018730302kdQRPU', secret: '944417ea359346e4ad882483cb63c13c' }); // ZF2018744533NVHTc0 ZF2018730302kdQRPU

//  --------- MongoDB ---------

const mongo = new Mongo();


export default class ZK implements Requester {
    static baseURL: 'https://m.mycchk.com/tools/submit_ajax.ashx';
    requester: MyReq = new MyReq('', { json: false });

    constructor(protected readonly txtCode: string, public txtUserName?:string, public txtPassword?:string) {}
    async getData(params, uri?, method = 'post', rqParams = { json: true }): Promise<any> {
        // let { baseURL } = ZK;
        let  { requester } = this;
        let url = uri || 'https://m.mycchk.com/tools/submit_ajax.ashx' + '?';
        for (const key in params) {
            if (params.hasOwnProperty(key)) {
                const element = params[key];
                url += `${key}=${element}&`
            }
        }
        return requester.workFlow(url, params, method, xdl.wrapParams({
            headers: {
                Host: 'm.mycchk.com',
                Origin: 'https://m.mycchk.com',
                Referer: 'https://m.mycchk.com/register.html?regcode=X4R4D2',
            },
            ...rqParams
        }));
    }
    async sendMSG(): Promise<any> {
        let mb;
        do {
            log('准备获取手机号');
            let [mobile] = (mb && [mb]) || await dz.getMobileNums();
            log('手机号以获取', mb = mobile);
            log('准备发送手机验证码');
            let result = await this.getData({
                action: 'user_regverify_smscode',
                site: 'mobile',
                mobile,
                areacode: 86
            });
            log('验证码已发送', result);
            if (result.status === 1) {
                log('使用DZ获取验证码');
                let { message } = await dz.getMessageByMobile(mobile);
                log('获取验证码完成', message);
                if (message) {
                    return {
                        txtMobile: mobile,
                        txtverifyCode: message.match(/【ZKCenter】您的验证码为：(\d+)，/)[1]
                        };
                } else {
                    mb = null;
                    dz.addIgnoreList(mobile);
                }
            } else if (result.msg === "对不起，该手机号码已被登记，请更新手机号码再次重注册。如是本人操作,请直接登入。！") {
                dz.addIgnoreList(mobile);
                mb = null;
            }
        } while (await wait(200, true));

    }

    async register(params): Promise<any> {
        return this.getData({
            action: 'user_register',
            site_id: 2,
            ...params
        })
    }

    async login(): Promise<any> {
        let { txtUserName, txtPassword } = this;
        return this.getData({
            action: 'user_login',
            site_id: 2,
            txtUserName,
            txtPassword
        }).then(data => {
            log('登录信息：\t', data);
        })
    }

    async task(id?):Promise<any> {
        log(`任务\t${id}\t开始！`);
        let mobileAndCode = await this.sendMSG();
        log('短信以获取', mobileAndCode);
        let { txtCode } = this;
        let regParams = {
            ...mobileAndCode,
            txtUserName:  getRandomStr(16, 14),
            txtPassword: `${getRandomStr(6)}and${(getRandomInt(9, 0, 6) as number[]).join('')}`,
            txtCode,
        }
        log('开始注册');
        let regResult;
        do {
            try {
                regResult = await this.register(regParams);
                if (regResult.status === 1) {
                    break;
                } else if (regResult.status === 0 && regResult.msg === '对不起，该用户名称已被登记，请更新用户名称再次重注册。如是本人操作,请直接登入。') {
                    regParams.txtUserName = getRandomStr(16, 14);
                    throwError(regResult);
                }
            } catch (error) {
                log(error, 'error');
            }
        } while (await wait(2000, true));
        log('注册完成', regResult);
        if (regResult.status === 1) {
            try {
                this.getData({}, 'https://m.mycchk.com/user/center/index.html', 'get', { json: false });
            } catch (error) {
                // log('获取首页，错误无需关注！', error, 'error');
            }
        }
        log(`任务\t${id}\t完成`, 'warn');
        let col = await mongo.getCollection('zk', 'regists');
        col.insertOne(regParams);
    }
}