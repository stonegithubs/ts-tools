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
const xdl = new xundaili_1.default({ orderno: 'ZF2018730302kdQRPU', secret: '944417ea359346e4ad882483cb63c13c' }); // ZF2018744533NVHTc0 ZF2018730302kdQRPU
//  --------- MongoDB ---------
const mongo = new mongo_1.default();
class ZK {
    constructor(txtCode, txtUserName, txtPassword) {
        this.txtCode = txtCode;
        this.txtUserName = txtUserName;
        this.txtPassword = txtPassword;
        this.requester = new request_1.default('', { json: false });
    }
    async getData(params, uri, method = 'post', rqParams = {}) {
        // let { baseURL } = ZK;
        let { requester } = this;
        let url = uri || 'https://m.mycchk.com/tools/submit_ajax.ashx' + '?';
        for (const key in params) {
            if (params.hasOwnProperty(key)) {
                const element = params[key];
                url += `${key}=${element}&`;
            }
        }
        return requester.workFlow('https://ip.cn', params, 'get', xdl.wrapParams(Object.assign({ headers: {
                // Host: 'm.mycchk.com',
                // Origin: 'https://m.mycchk.com',
                // Referer: 'https://m.mycchk.com/register.html?regcode=X4R4D2',
                // 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1'
            } }, rqParams)));
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
    }
}
exports.default = ZK;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiemsuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29uc3VtZXJzL3prL3prLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxvQkFBb0I7Ozs7O0FBRXBCLDZEQUFxQztBQUNyQyx3RUFBZ0Q7QUFDaEQsZ0VBQXNDO0FBQ3RDLDJEQUFtQztBQUNuQywyQ0FBb0Y7QUFHcEYsMEJBQTBCO0FBRTFCLE1BQU0sRUFBRSxHQUFHLElBQUksWUFBRSxDQUFDLGdCQUFnQixFQUFFLGNBQWMsRUFBRSxPQUFPLENBQUMsQ0FBQztBQUU3RCxnQ0FBZ0M7QUFFaEMsTUFBTSxHQUFHLEdBQUcsSUFBSSxrQkFBUSxDQUFDLEVBQUUsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sRUFBRSxrQ0FBa0MsRUFBRSxDQUFDLENBQUMsQ0FBQyx3Q0FBd0M7QUFFakosK0JBQStCO0FBRS9CLE1BQU0sS0FBSyxHQUFHLElBQUksZUFBSyxFQUFFLENBQUM7QUFHMUI7SUFJSSxZQUErQixPQUFlLEVBQVMsV0FBbUIsRUFBUyxXQUFtQjtRQUF2RSxZQUFPLEdBQVAsT0FBTyxDQUFRO1FBQVMsZ0JBQVcsR0FBWCxXQUFXLENBQVE7UUFBUyxnQkFBVyxHQUFYLFdBQVcsQ0FBUTtRQUZ0RyxjQUFTLEdBQVUsSUFBSSxpQkFBSyxDQUFDLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO0lBRXVELENBQUM7SUFDMUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsR0FBSSxFQUFFLE1BQU0sR0FBRyxNQUFNLEVBQUUsUUFBUSxHQUFHLEVBQUk7UUFDeEQsd0JBQXdCO1FBQ3hCLElBQUssRUFBRSxTQUFTLEVBQUUsR0FBRyxJQUFJLENBQUM7UUFDMUIsSUFBSSxHQUFHLEdBQUcsR0FBRyxJQUFJLDZDQUE2QyxHQUFHLEdBQUcsQ0FBQztRQUNyRSxLQUFLLE1BQU0sR0FBRyxJQUFJLE1BQU0sRUFBRTtZQUN0QixJ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