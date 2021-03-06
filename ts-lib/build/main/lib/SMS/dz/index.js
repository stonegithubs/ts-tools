"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_1 = __importDefault(require("../../../lib/request"));
const utils_1 = require("../../utils");
class DZ {
    constructor(uid, pwd, pid) {
        this.uid = uid;
        this.pwd = pwd;
        this.pid = pid;
        this.requester = new request_1.default(DZ.baseURL, { json: false });
    }
    // 登陆 DZ, 获取 token
    async login() {
        let { uid, pwd, requester } = this;
        let result = await requester.workFlow('', { action: 'loginIn', uid, pwd }) || '';
        return this.token = result.split('|')[1] || utils_1.throwError(`登陆错误:\t${result}`);
    }
    // 获取用户信息, 包含 uid, scores(积分), coins(用户币), maxParallelCount(同时可获取号码数)
    async getUserInfo() {
        await this._checkLogin();
        let { uid, token, requester } = this;
        let result = await requester.workFlow('', { action: 'getUserInfo', uid, token });
        let [, scores, coins, maxParallelCount] = result.split(';');
        return maxParallelCount !== undefined ? { uid, scores, coins, maxParallelCount } : utils_1.throwError(`获取用户信息错误:\t${result}`);
    }
    async getMessageByMobile(mobile, reuse, next_pid) {
        await this._checkLogin();
        let { uid, token, requester } = this;
        let action = reuse ? 'getVcodeAndHoldMobilenum' : 'getVcodeAndReleaseMobile';
        let result = '';
        do {
            try {
                result = await requester.workFlow('', { action, uid, token, mobile, next_pid, author_uid: 'zhang179817004' }) || '';
            }
            catch (error) {
                utils_1.log('dz获取短信中，出现中途异常', error, 'error');
            }
        } while ((result === 'not_receive' || result === 'message|to_fast_try_again') && await utils_1.wait(2000, true));
        utils_1.log('dz获取短信结果', result);
        let [, message] = result.split('|');
        return { mobile, message };
    }
    // 获取短信验证码, 返回为 [{ mobile, message }] 类型
    async getMessage(size = 1, getMobileNumParams, reuse, next_pid) {
        await this._checkLogin();
        let result = await this.getMobileNums(Object.assign({ size }, getMobileNumParams));
        return result ? Promise.all(result.map(mobile => this.getMessageByMobile(mobile, reuse, next_pid))) : utils_1.throwError(`没有获取到手机号:\t${JSON.stringify(result)}`);
    }
    // 获取手机号, pid 为项目名, size 为获取条数
    async getMobileNums(params) {
        await this._checkLogin();
        let { uid, token, requester } = this;
        let result = await requester.workFlow('', Object.assign({ action: 'getMobilenum', uid, token, size: 1, pid: this.pid }, params));
        let [data] = result.split('|');
        return data ? data.split(';') : utils_1.throwError(`获取手机号错误:\t${result}`);
    }
    // 请求以获取手机号列表
    async getRecvingInfo(params) {
        await this._checkLogin();
        let { uid, token, requester } = this;
        let result = await requester.workFlow('', Object.assign({ action: 'getRecvingInfo', uid, token }, params));
        return Array.isArray(result) ? result : utils_1.throwError(`请求已获取号码列表失败:\t${result}`);
    }
    // 号码加黑
    async addIgnoreList(mobiles, params) {
        await this._checkLogin();
        mobiles = Array.isArray(mobiles) ? mobiles.join(',') : mobiles;
        let { uid, token, requester } = this;
        let result = await requester.workFlow('', Object.assign({ action: 'addIgnoreList', mobiles, uid, token, pid: this.pid }, params));
        return result;
    }
    async _checkLogin() {
        let { token } = this;
        if (!token) {
            await this.login();
        }
    }
}
DZ.baseURL = 'http://api.jmyzm.com/http.do';
exports.default = DZ;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbGliL1NNUy9kei9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLG1FQUF1QztBQUN2Qyx1Q0FBb0Q7QUFHcEQ7SUFJRSxZQUFzQixHQUFXLEVBQVksR0FBVyxFQUFZLEdBQVk7UUFBMUQsUUFBRyxHQUFILEdBQUcsQ0FBUTtRQUFZLFFBQUcsR0FBSCxHQUFHLENBQVE7UUFBWSxRQUFHLEdBQUgsR0FBRyxDQUFTO1FBRmhGLGNBQVMsR0FBUSxJQUFJLGlCQUFHLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO0lBRTZCLENBQUM7SUFFcEYsa0JBQWtCO0lBQ2xCLEtBQUssQ0FBQyxLQUFLO1FBQ1QsSUFBSSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFFLEdBQUcsSUFBSSxDQUFDO1FBQ25DLElBQUksTUFBTSxHQUFHLE1BQU0sU0FBUyxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNqRixPQUFPLElBQUksQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxrQkFBVSxDQUFDLFVBQVUsTUFBTSxFQUFFLENBQUMsQ0FBQztJQUM3RSxDQUFDO0lBRUQscUVBQXFFO0lBQ3JFLEtBQUssQ0FBQyxXQUFXO1FBQ2YsTUFBTSxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDekIsSUFBSSxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLEdBQUcsSUFBSSxDQUFDO1FBQ3JDLElBQUksTUFBTSxHQUFHLE1BQU0sU0FBUyxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsRUFB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