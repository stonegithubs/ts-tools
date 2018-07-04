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
    async _getMessage(mobile, reuse, next_pid) {
        let { uid, token, requester } = this;
        let action = reuse ? 'getVcodeAndHoldMobilenum' : 'getVcodeAndReleaseMobile';
        let result = '';
        do {
            result = await requester.workFlow('', { action, uid, token, mobile, next_pid, author_uid: 'zhang179817004' });
        } while (result === 'not_receive' && await utils_1.wait(2000, true));
        let [, code] = result.split('|');
        return { mobile, code };
    }
    // 获取短信验证码, 返回为 [{ mobile, code }] 类型
    async getMessage(size = 1, getMobileNumParams, reuse, next_pid) {
        await this._checkLogin();
        let { uid, token, requester } = this;
        let result = await this.getMobileNums(Object.assign({ size }, getMobileNumParams));
        return result ? Promise.all(result.map(mobile => this._getMessage(mobile, reuse, next_pid))) : utils_1.throwError(`没有获取到手机号:\t${JSON.stringify(result)}`);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHouanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbGliL1NNUy9kei9kei50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLG1FQUF1QztBQUN2Qyx1Q0FBK0M7QUFHL0M7SUFJRSxZQUFzQixHQUFXLEVBQVksR0FBVyxFQUFZLEdBQVk7UUFBMUQsUUFBRyxHQUFILEdBQUcsQ0FBUTtRQUFZLFFBQUcsR0FBSCxHQUFHLENBQVE7UUFBWSxRQUFHLEdBQUgsR0FBRyxDQUFTO1FBRmhGLGNBQVMsR0FBUSxJQUFJLGlCQUFHLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO0lBRTZCLENBQUM7SUFFcEYsa0JBQWtCO0lBQ2xCLEtBQUssQ0FBQyxLQUFLO1FBQ1QsSUFBSSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFFLEdBQUcsSUFBSSxDQUFDO1FBQ25DLElBQUksTUFBTSxHQUFHLE1BQU0sU0FBUyxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNqRixPQUFPLElBQUksQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxrQkFBVSxDQUFDLFVBQVUsTUFBTSxFQUFFLENBQUMsQ0FBQztJQUM3RSxDQUFDO0lBRUQscUVBQXFFO0lBQ3JFLEtBQUssQ0FBQyxZQUFZO1FBQ2hCLE1BQU0sSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ3pCLElBQUksRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxHQUFHLElBQUksQ0FBQztRQUNyQyxJQUFJLE1BQU0sR0FBRyxNQUFNLFNBQVMsQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFFLEVBQUUsTUFB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