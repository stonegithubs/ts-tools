// 2018年7月8日23:37:17

import Mongo from '../../lib/mongo/';
import XunDaili from '../../lib/proxy/xundaili';
import MyReq from '../../lib/request';
import DZ from '../../lib/SMS/dz/';
import { getRandomInt, getRandomStr, log, throwError, wait, randomUA } from '../../lib/utils';
import Requester from '../../lib/utils/declarations/requester';
import AutoProxy from '../../lib/proxy/autoProxy/autoProxy';

//  --------- DZ ---------

const dz = new DZ('zhang179817004', 'qq179817004*', '48108');

//  --------- XunDaili ---------

const xdl = new XunDaili({ orderno: 'ZF20187249103GcJiAA', secret: 'f7691def90804df3ba830c1a1308a718' }); // ZF2018744533NVHTc0 ZF20187249103GcJiAA

//  --------- MongoDB ---------

const mongo = new Mongo();


export default class ZK// implements Requester
{
    static baseURL: 'https://m.mycchk.com/tools/submit_ajax.ashx';
    // requester: MyReq = new MyReq('', { json: false });
    sender = new AutoProxy();
    constructor(protected readonly txtCode: string, public txtUserName?:string, public txtPassword?:string) {}
    async getData(params, uri?, method = 'post', rqParams = { json: true }): Promise<any> {
        // let { baseURL } = ZK;
        let  { sender } = this;
        let url = uri || 'https://m.mycchk.com/tools/submit_ajax.ashx' + '?';
        for (const key in params) {
            if (params.hasOwnProperty(key)) {
                const element = params[key];
                url += `${key}=${element}&`
            }
        }
        var p = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
                'Host': 'm.mycchk.com',
                'Origin': 'https://m.mycchk.com',
                'Pragma': 'no-cache',
                'Referer': 'https://m.mycchk.com/login.html',
                'User-Agent': randomUA()
            },
            ...rqParams,
            form: params
        } as any;
        // console.log(JSON.parse(JSON.stringify(p)), xdl.wrapParams(JSON.parse(JSON.stringify(p))) );
        return sender.send(url, params, method, //xdl.wrapParams(
            p
    //    )
        ).then(data => {
            try {
                return typeof data === 'string' ? JSON.parse(data) : data;
            } catch (error) {
                return data;
            }
        })
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

    async login(taskId?): Promise<any> {
        let { txtUserName, txtPassword } = this;
        do {
            try {
                return await this.getData({
                    action: 'user_login',
                    site_id: 2,
                    txtUserName,
                    txtPassword
                }).then(data => {
                    log(`${taskId}登录成功：\t`, { txtUserName, txtPassword }, data);
                })
            } catch (error) {
                this.sender = new AutoProxy();
                log('登陆失败', error, 'error');
            }
        } while (await wait(2000, true));
    }

    async task(id?):Promise<any> {
        do {
            begin: {

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
                        } else if (regResult.status === 0 && regResult.msg === '您输入的验证码与系统的不一致！') {
                            break begin;
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
                return;
            }

        } while (await wait(2000, true));

    }
}