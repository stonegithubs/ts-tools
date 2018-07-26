"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_1 = __importDefault(require("../../request"));
const proxyPool_1 = __importDefault(require("../proxyPool/proxyPool"));
const https_proxy_agent_1 = __importDefault(require("https-proxy-agent")); // https 代理, 用于添加 connection 头
const utils_1 = require("../../utils");
class AutoProxy {
    constructor() {
        this.requester = new request_1.default();
    }
    async send(url, data = {}, method = 'get', params = {}) {
        let { proxy, requester } = this;
        let { pool } = AutoProxy;
        let timeout = params.timeout || 1000 * 60 * 4;
        if (!proxy) {
            let [proxyUrl] = await pool.getProxies(1, true);
            this.proxy = proxy = proxyUrl;
        }
        let { ip, port } = proxy;
        let agent = new https_proxy_agent_1.default({ host: ip, port });
        utils_1.log('使用代理', proxy);
        let req = requester.workFlow(url, data, method, Object.assign({ rejectUnauthorized: false, agent }, params));
        if (timeout) {
            return Promise.race([req, utils_1.wait(timeout, utils_1.throwError.bind(null, '发生错误'))]);
        }
        else {
            return req;
        }
    }
}
AutoProxy.proxyList = [];
AutoProxy.pool = new proxyPool_1.default();
exports.default = AutoProxy;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0b1Byb3h5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2xpYi9wcm94eS9hdXRvUHJveHkvYXV0b1Byb3h5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsNERBQWtDO0FBRWxDLHVFQUErQztBQUMvQywwRUFBZ0QsQ0FBQyw4QkFBOEI7QUFDL0UsdUNBQW9EO0FBRXBEO0lBS0U7UUFGQSxjQUFTLEdBQUcsSUFBSSxpQkFBSyxFQUFFLENBQUM7SUFFVCxDQUFDO0lBQ2hCLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUksR0FBRyxFQUFFLEVBQUUsTUFBTSxHQUFHLEtBQUssRUFBRSxTQUFjLEVBQUU7UUFDekQsSUFBSSxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsR0FBRyxJQUFJLENBQUM7UUFDaEMsSUFBSSxFQUFFLElBQUksRUFBRSxHQUFHLFNBQVMsQ0FBQztRQUN6QixJQUFJLE9BQU8sR0FBRyxNQUFNLENBQUMsT0FBTyxJQUFJLElBQUksR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQzlDLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDVixJQUFJLENBQUUsUUFBUSxDQUFFLEdBQUcsTUFBTSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNsRCxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssR0FBRyxRQUFRLENBQUM7U0FDL0I7UUFDRCxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxHQUFHLEtBQUssQ0FBQztRQUN6QixJQUFJLEtBQUssR0FBRyxJQUFJLDJCQUFlLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7UUFDcEQsV0FBRyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNuQixJQUFJLEdBQUcsR0FBRyxTQUFTLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsTUFBTSxrQkFBSSxrQkFBa0IsRUFBRSxLQUFLLEVBQUUsS0FBSyxJQUFLLE1BQU0sRUFBRyxDQUFDO1FBQ2pHLElBQUksT0FBTyxFQUFFO1lBQ1gsT0FBTyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLFlBQUksQ0FBQyxPQUFPLEVBQUUsa0JBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQzFFO2FBQU07WUFDTCxPQUFPLEdBQUcsQ0FBQztTQUNaO0lBQ0gsQ0FBQzs7QUF0Qk0sbUJBQVMsR0FBRyxFQUFFLENBQUM7QUFDZixjQUFJLEdBQUcsSUFBSSxtQkFBUyxFQUFFLENBQUM7QUFGaEMsNEJBd0JDIn0=