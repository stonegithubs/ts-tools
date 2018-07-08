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
const request_1 = __importDefault(require("../../lib/request"));
//  --------- DZ ---------
const dz = new dz_1.default('zhang179817004', 'qq179817004*', '48108');
//  --------- XunDaili ---------
const xdl = new xundaili_1.default({ orderno: 'ZF2018730302kdQRPU', secret: '944417ea359346e4ad882483cb63c13c' }); // ZF2018744533NVHTc0 ZF2018730302kdQRPU
//  --------- MongoDB ---------
const mongo = new mongo_1.default();
class ZK {
    constructor(txtCode) {
        this.txtCode = txtCode;
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
        return requester.workFlow(url, params, method, xdl.wrapHeader(Object.assign({ headers: {
                Host: 'm.mycchk.com',
                Origin: 'https://m.mycchk.com',
                Referer: 'https://m.mycchk.com/register.html?regcode=X4R4D2',
                'Content-Type': 'application/x-www-form-urlencoded'
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiemsuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29uc3VtZXJzL3prL3prLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxvQkFBb0I7Ozs7O0FBRXBCLDZEQUFxQztBQUNyQyx3RUFBZ0Q7QUFDaEQsMkRBQW1DO0FBQ25DLDJDQUFvRjtBQUVwRixnRUFBc0M7QUFFdEMsMEJBQTBCO0FBRTFCLE1BQU0sRUFBRSxHQUFHLElBQUksWUFBRSxDQUFDLGdCQUFnQixFQUFFLGNBQWMsRUFBRSxPQUFPLENBQUMsQ0FBQztBQUU3RCxnQ0FBZ0M7QUFFaEMsTUFBTSxHQUFHLEdBQUcsSUFBSSxrQkFBUSxDQUFDLEVBQUUsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sRUFBRSxrQ0FBa0MsRUFBRSxDQUFDLENBQUMsQ0FBQyx3Q0FBd0M7QUFFakosK0JBQStCO0FBRS9CLE1BQU0sS0FBSyxHQUFHLElBQUksZUFBSyxFQUFFLENBQUM7QUFHMUI7SUFHSSxZQUErQixPQUFlO1FBQWYsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQUQ5QyxjQUFTLEdBQVUsSUFBSSxpQkFBSyxDQUFDLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO0lBQ0QsQ0FBQztJQUNsRCxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxHQUFJLEVBQUUsTUFBTSxHQUFHLE1BQU0sRUFBRSxRQUFRLEdBQUcsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFO1FBQ2xFLHdCQUF3QjtRQUN4QixJQUFLLEVBQUUsU0FBUyxFQUFFLEdBQUcsSUFBSSxDQUFDO1FBQzFCLElBQUksR0FBRyxHQUFHLEdBQUcsSUFBSSw2Q0FBNkMsR0FBRyxHQUFHLENBQUM7UUFDckUsS0FBSyxNQUFNLEdBQUcsSUFBSSxNQUFNLEVBQUU7WUFDdEIsSUFBSSxNQUFNLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxFQUFFO2dCQUM1QixNQUFNLE9BQU8s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