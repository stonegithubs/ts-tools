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
    async getUserInfos() {
        await this._checkLogin();
        let { uid, token, requester } = this;
        let result = await requester.workFlow('', { action: 'getUserInfos', uid, token });
        let [, scores, coins, maxParallelCount] = result.split(';');
        return maxParallelCount !== undefined ? { uid, scores, coins, maxParallelCount } : utils_1.throwError(`获取用户信息错误:\t${result}`);
    }
    async getMessageByMobile(mobile, reuse, next_pid) {
        let { uid, token, requester } = this;
        let action = reuse ? 'getVcodeAndHoldMobilenum' : 'getVcodeAndReleaseMobile';
        let result = '';
        do {
            result = await requester.workFlow('', { action, uid, token, mobile, next_pid, author_uid: 'zhang179817004' }) || '';
        } while (result === 'not_receive' && await utils_1.wait(2000, true));
        let [, message] = result.split('|');
        return { mobile, message };
    }
    // 获取短信验证码, 返回为 [{ mobile, message }] 类型
    async getMessage(size = 1, getMobileNumParams, reuse, next_pid) {
        await this._checkLogin();
        let { uid, token, requester } = this;
        let result = await this.getMobileNums(Object.assign({ size }, getMobileNumParams));
        return result ? Promise.all(result.map(mobile => this.getMessageByMobile(mobile, reuse, next_pid))) : utils_1.throwError(`没有获取到手机号:\t${JSON.stringify(result)}`);
    }
    // 获取手机号, pid 为项目名, size 为获取条数
    async getMobileNums(params) {
        await this._checkLogin();
        let { uid, token, requester } = this;
        let result = await requester.workFlow('', Object.assign({ action: 'getMobilenum', uid, token, size: 1, pid: this.pid }, params));
        let data = result.split('|')[0];
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
        let result = await requester.workFlow('', Object.assign({ action: 'addIgnoreList', uid, token, pid: this.pid }, params));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbGliL1NNUy9kei9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLG1FQUF1QztBQUN2Qyx1Q0FBK0M7QUFHL0M7SUFJRSxZQUFzQixHQUFXLEVBQVksR0FBVyxFQUFZLEdBQVk7UUFBMUQsUUFBRyxHQUFILEdBQUcsQ0FBUTtRQUFZLFFBQUcsR0FBSCxHQUFHLENBQVE7UUFBWSxRQUFHLEdBQUgsR0FBRyxDQUFTO1FBRmhGLGNBQVMsR0FBUSxJQUFJLGlCQUFHLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO0lBRTZCLENBQUM7SUFFcEYsa0JBQWtCO0lBQ2xCLEtBQUssQ0FBQyxLQUFLO1FBQ1QsSUFBSSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFFLEdBQUcsSUFBSSxDQUFDO1FBQ25DLElBQUksTUFBTSxHQUFHLE1BQU0sU0FBUyxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNqRixPQUFPLElBQUksQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxrQkFBVSxDQUFDLFVBQVUsTUFBTSxFQUFFLENBQUMsQ0FBQztJQUM3RSxDQUFDO0lBRUQscUVBQXFFO0lBQ3JFLEtBQUssQ0FBQyxZQUFZO1FBQ2hCLE1BQU0sSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ3pCLElBQUksRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxHQUFHLElBQUksQ0FBQztRQUNyQyxJQUFJLE1BQU0sR0FBRyxNQUFNLFNBQVMsQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFFLEVB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