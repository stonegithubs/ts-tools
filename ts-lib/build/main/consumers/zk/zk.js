"use strict";
// 2018年7月8日23:37:17
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongo_1 = __importDefault(require("../../lib/mongo/"));
const xundaili_1 = __importDefault(require("../../lib/proxy/xundaili"));
const dz_1 = __importDefault(require("../../lib/SMS/dz/"));
const utils_1 = require("../../lib/utils");
const autoProxy_1 = __importDefault(require("../../lib/proxy/autoProxy/autoProxy"));
//  --------- DZ ---------
const dz = new dz_1.default('zhang179817004', 'qq179817004*', '48108');
//  --------- XunDaili ---------
const xdl = new xundaili_1.default({ orderno: 'ZF20187249103GcJiAA', secret: 'f7691def90804df3ba830c1a1308a718' }); // ZF2018744533NVHTc0 ZF20187249103GcJiAA
//  --------- MongoDB ---------
const mongo = new mongo_1.default();
class ZK // implements Requester
 {
    constructor(txtCode, txtUserName, txtPassword) {
        this.txtCode = txtCode;
        this.txtUserName = txtUserName;
        this.txtPassword = txtPassword;
        // requester: MyReq = new MyReq('', { json: false });
        this.sender = new autoProxy_1.default();
    }
    async getData(params, uri, method = 'post', rqParams = { json: true }) {
        // let { baseURL } = ZK;
        let { sender } = this;
        let url = uri || 'https://m.mycchk.com/tools/submit_ajax.ashx' + '?';
        for (const key in params) {
            if (params.hasOwnProperty(key)) {
                const element = params[key];
                url += `${key}=${element}&`;
            }
        }
        var p = Object.assign({ headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
                'Host': 'm.mycchk.com',
                'Origin': 'https://m.mycchk.com',
                'Pragma': 'no-cache',
                'Referer': 'https://m.mycchk.com/login.html',
                'User-Agent': utils_1.randomUA()
            }, timeout: 1000 * 60 * 3 }, rqParams, { form: params });
        // console.log(JSON.parse(JSON.stringify(p)), xdl.wrapParams(JSON.parse(JSON.stringify(p))) );
        return sender.send(url, params, method, //xdl.wrapParams(
        p
        //    )
        ).then(data => {
            try {
                return typeof data === 'string' ? JSON.parse(data) : data;
            }
            catch (error) {
                return data;
            }
        });
    }
    async sendMSG() {
        let mb;
        do {
            utils_1.log('准备获取手机号');
            let [mobile] = (mb && [mb]) || await dz.getMobileNums(); //18374266728
            utils_1.log('手机号以获取', mb = mobile);
            utils_1.log('准备发送手机验证码');
            let result = await this.getData({
                action: 'user_regverify_smscode',
                site: 'mobile',
                mobile,
                areacode: 86
            });
            utils_1.log(`${mobile}验证码已发送`, result);
            if (result.status === 1) {
                utils_1.log('使用DZ获取验证码');
                let { message } = await dz.getMessageByMobile(mobile);
                utils_1.log('获取验证码完成', message);
                if (message) {
                    return {
                        txtMobile: mobile,
                        txtverifyCode: message.match(/【ZKCenter】您的验证码为：(\d+)，/)[1]
                    };
                }
                else {
                    mb = null;
                    dz.addIgnoreList(mobile);
                }
            }
            else if (result.msg === "对不起，该手机号码已被登记，请更新手机号码再次重注册。如是本人操作,请直接登入。！") {
                dz.addIgnoreList(mobile);
                mb = null;
            }
        } while (await utils_1.wait(200, true));
    }
    async register(params) {
        return this.getData(Object.assign({ action: 'user_register', site_id: 2 }, params));
    }
    async login(taskId) {
        let { txtUserName, txtPassword } = this;
        do {
            try {
                return await this.getData({
                    action: 'user_login',
                    site_id: 2,
                    txtUserName,
                    txtPassword
                }).then(data => {
                    utils_1.log(`${taskId}登录成功：\t`, { txtUserName, txtPassword }, data, 'warn');
                });
            }
            catch (error) {
                this.sender = new autoProxy_1.default();
                utils_1.log('登陆失败', error, 'error');
            }
        } while (await utils_1.wait(2000, true));
    }
    async task(id) {
        do {
            begin: {
                utils_1.log(`任务\t${id}\t开始！`);
                let mobileAndCode = await this.sendMSG();
                utils_1.log('短信以获取', mobileAndCode);
                let { txtCode } = this;
                let regParams = Object.assign({}, mobileAndCode, { txtUserName: utils_1.getRandomStr(16, 14), txtPassword: `${utils_1.getRandomStr(6)}and${utils_1.getRandomInt(9, 0, 6).join('')}`, txtCode });
                utils_1.log('开始注册');
                let regResult;
                do {
                    try {
                        regResult = await this.register(regParams);
                        if (regResult.status === 1) {
                            break;
                        }
                        else if (regResult.status === 0 && regResult.msg === '对不起，该用户名称已被登记，请更新用户名称再次重注册。如是本人操作,请直接登入。') {
                            regParams.txtUserName = utils_1.getRandomStr(16, 14);
                            utils_1.throwError(regResult);
                        }
                        else if (regResult.status === 0 && regResult.msg === '您输入的验证码与系统的不一致！') {
                            break begin;
                        }
                    }
                    catch (error) {
                        utils_1.log(error, 'error');
                    }
                } while (await utils_1.wait(2000, true));
                utils_1.log('注册完成', regResult);
                if (regResult.status === 1) {
                    try {
                        this.getData({}, 'https://m.mycchk.com/user/center/index.html', 'get', { json: false });
                    }
                    catch (error) {
                        // log('获取首页，错误无需关注！', error, 'error');
                    }
                }
                utils_1.log(`任务\t${id}\t完成`, 'warn');
                let col = await mongo.getCollection('zk', 'regists');
                col.insertOne(regParams);
                return;
            }
        } while (await utils_1.wait(2000, true));
    }
}
exports.default = ZK;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiemsuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29uc3VtZXJzL3prL3prLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxvQkFBb0I7Ozs7O0FBRXBCLDZEQUFxQztBQUNyQyx3RUFBZ0Q7QUFFaEQsMkRBQW1DO0FBQ25DLDJDQUE4RjtBQUU5RixvRkFBNEQ7QUFFNUQsMEJBQTBCO0FBRTFCLE1BQU0sRUFBRSxHQUFHLElBQUksWUFBRSxDQUFDLGdCQUFnQixFQUFFLGNBQWMsRUFBRSxPQUFPLENBQUMsQ0FBQztBQUU3RCxnQ0FBZ0M7QUFFaEMsTUFBTSxHQUFHLEdBQUcsSUFBSSxrQkFBUSxDQUFDLEVBQUUsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sRUFBRSxrQ0FBa0MsRUFBRSxDQUFDLENBQUMsQ0FBQyx5Q0FBeUM7QUFFbkosK0JBQStCO0FBRS9CLE1BQU0sS0FBSyxHQUFHLElBQUksZUFBSyxFQUFFLENBQUM7QUFHMUIsU0FBdUIsdUJBQXVCOztJQUsxQyxZQUErQixPQUFlLEVBQVMsV0FBbUIsRUFBUyxXQUFtQjtRQUF2RSxZQUFPLEdBQVAsT0FBTyxDQUFRO1FBQVMsZ0JBQVcsR0FBWCxXQUFXLENBQVE7UUFBUyxnQkFBVyxHQUFYLFdBQVcsQ0FBUTtRQUZ0RyxxREFBcUQ7UUFDckQsV0FBTSxHQUFHLElBQUksbUJBQVMsRUFBRSxDQUFDO0lBQ2dGLENBQUM7SUFDMUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsR0FBSSxFQUFFLE1BQU0sR0FBRyxNQUFNLEVBQUUsUUFBUSxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRTtRQUNsRSx3QkFBd0I7UUFDeEIsSUFBSyxFQUFFLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQztRQUN2QixJQUFJLEdBQUcsR0FBRyxHQUFHLElBQUksNkNBQTZDLEdBQUcsR0FBRyxDQUFDO1FBQ3JFLEtBQUssTUFBTSxHQUFHLElBQUksTUFBTSxFQUFF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