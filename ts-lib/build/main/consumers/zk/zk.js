"use strict";
// 2018年7月8日23:37:17
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongo_1 = __importDefault(require("../../lib/mongo/"));
const xundaili_1 = __importDefault(require("../../lib/proxy/xundaili"));
const request_1 = __importDefault(require("../../lib/request"));
const dz_1 = __importDefault(require("../../lib/SMS/dz/"));
const utils_1 = require("../../lib/utils");
//  --------- DZ ---------
const dz = new dz_1.default('zhang179817004', 'qq179817004*', '48108');
//  --------- XunDaili ---------
const xdl = new xundaili_1.default({ orderno: 'ZF20187249103GcJiAA', secret: 'f7691def90804df3ba830c1a1308a718' }); // ZF2018744533NVHTc0 ZF20187249103GcJiAA
//  --------- MongoDB ---------
const mongo = new mongo_1.default();
class ZK {
    constructor(txtCode, txtUserName, txtPassword) {
        this.txtCode = txtCode;
        this.txtUserName = txtUserName;
        this.txtPassword = txtPassword;
        this.requester = new request_1.default('', { json: false });
    }
    async getData(params, uri, method = 'post', rqParams = { json: true }) {
        // let { baseURL } = ZK;
        let { requester } = this;
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
            } }, rqParams, { form: params });
        console.log(JSON.parse(JSON.stringify(p)), xdl.wrapParams(JSON.parse(JSON.stringify(p))));
        return requester.workFlow(url, params, method, //xdl.wrapParams(
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
            let [mobile] = (mb && [mb]) || await dz.getMobileNums();
            utils_1.log('手机号以获取', mb = mobile);
            utils_1.log('准备发送手机验证码');
            let result = await this.getData({
                action: 'user_regverify_smscode',
                site: 'mobile',
                mobile,
                areacode: 86
            });
            utils_1.log('验证码已发送', result);
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
    async login() {
        let { txtUserName, txtPassword } = this;
        return this.getData({
            action: 'user_login',
            site_id: 2,
            txtUserName,
            txtPassword
        }).then(data => {
            utils_1.log('登录信息：\t', data);
        });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiemsuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29uc3VtZXJzL3prL3prLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxvQkFBb0I7Ozs7O0FBRXBCLDZEQUFxQztBQUNyQyx3RUFBZ0Q7QUFDaEQsZ0VBQXNDO0FBQ3RDLDJEQUFtQztBQUNuQywyQ0FBOEY7QUFHOUYsMEJBQTBCO0FBRTFCLE1BQU0sRUFBRSxHQUFHLElBQUksWUFBRSxDQUFDLGdCQUFnQixFQUFFLGNBQWMsRUFBRSxPQUFPLENBQUMsQ0FBQztBQUU3RCxnQ0FBZ0M7QUFFaEMsTUFBTSxHQUFHLEdBQUcsSUFBSSxrQkFBUSxDQUFDLEVBQUUsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sRUFBRSxrQ0FBa0MsRUFBRSxDQUFDLENBQUMsQ0FBQyx5Q0FBeUM7QUFFbkosK0JBQStCO0FBRS9CLE1BQU0sS0FBSyxHQUFHLElBQUksZUFBSyxFQUFFLENBQUM7QUFHMUI7SUFJSSxZQUErQixPQUFlLEVBQVMsV0FBbUIsRUFBUyxXQUFtQjtRQUF2RSxZQUFPLEdBQVAsT0FBTyxDQUFRO1FBQVMsZ0JBQVcsR0FBWCxXQUFXLENBQVE7UUFBUyxnQkFBVyxHQUFYLFdBQVcsQ0FBUTtRQUZ0RyxjQUFTLEdBQVUsSUFBSSxpQkFBSyxDQUFDLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO0lBRXVELENBQUM7SUFDMUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsR0FBSSxFQUFFLE1BQU0sR0FBRyxNQUFNLEVBQUUsUUFBUSxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRTtRQUNsRSx3QkFBd0I7UUFDeEIsSUFBSyxFQUFFLFNBQVMsRUFBRSxHQUFHLElBQUksQ0FBQztRQUMxQixJQUFJLEdBQUcsR0FBRyxHQUFHLElBQUksNkNBQTZDLEdBQUcsR0FBRyxDQUFDO1FBQ3JFLEtBQUssTUFBTSxHQUFHLElB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