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
            result = await requester.workFlow('', { action, uid, token, mobile, next_pid, author_uid: 'zhang179817004' }) || '';
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