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
    // strict 为 true 时，如果发送错误则会抛出错误然后退出发送数据，为 false 时则会换个 proxy 继续尝试发送
    constructor(requesterConf, debug = false, strict = false) {
        this.debug = debug;
        this.strict = strict;
        this.requester = new request_1.default();
        if (requesterConf) {
            this.requester = new request_1.default(requesterConf.baseUrl, requesterConf.conf);
        }
    }
    async send(url, data = {}, method = 'get', params = {}) {
        let { proxy, strict, requester, debug } = this;
        let { pool } = AutoProxy;
        let timeout = params.timeout || 1000 * 60 * 4.5;
        do {
            if (debug) {
                return requester.workFlow(url, data, method, Object.assign({ rejectUnauthorized: false }, params));
            }
            if (!proxy) {
                let [proxyUrl] = await pool.getProxies(1, true);
                this.proxy = proxy = proxyUrl;
            }
            let { ip, port } = proxy;
            let agent = new https_proxy_agent_1.default({ host: ip, port });
            utils_1.log('使用代理', proxy);
            let req = requester.workFlow(url, data, method, Object.assign({ rejectUnauthorized: false, agent, timeout }, params));
            let result;
            try {
                if (timeout) {
                    result = await Promise.race([req, utils_1.wait(timeout, () => !result && Promise.reject('AutoProxy wait timeout超时'))]);
                    return result;
                }
                else {
                    return await req;
                }
            }
            catch (error) {
                proxy = null;
                result = true; // 设置为 true 表示在 wait 之前接口已经有数据返回，本轮循环不需要再 reject
                utils_1.log('AutoProxy发生错误，即将进行重试，错误信息:', error, 'error');
            }
        } while (!strict);
    }
    async update() {
        let { pool } = AutoProxy;
        this.requester = new request_1.default();
        this.proxy = await pool.getProxies(1, true);
    }
}
AutoProxy.proxyList = [];
AutoProxy.pool = new proxyPool_1.default();
exports.default = AutoProxy;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0b1Byb3h5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2xpYi9wcm94eS9hdXRvUHJveHkvYXV0b1Byb3h5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsNERBQWtDO0FBRWxDLHVFQUErQztBQUMvQywwRUFBZ0QsQ0FBQyw4QkFBOEI7QUFDL0UsdUNBQW9EO0FBRXBEO0lBS0Usa0VBQWtFO0lBQ2xFLFlBQVksYUFBYyxFQUFTLFFBQVEsS0FBSyxFQUFTLFNBQVMsS0FBSztRQUFwQyxVQUFLLEdBQUwsS0FBSyxDQUFRO1FBQVMsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUh2RSxjQUFTLEdBQUcsSUFBSSxpQkFBSyxFQUFFLENBQUM7UUFJdEIsSUFBSSxhQUFhLEVBQUU7WUFDakIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLGlCQUFLLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDdkU7SUFDSCxDQUFDO0lBQ0QsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxHQUFHLEVBQUUsRUFBRSxNQUFNLEdBQUcsS0FBSyxFQUFFLFNBQWMsRUFBRTtRQUN6RCxJQUFJLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLEdBQUcsSUFBSSxDQUFDO1FBQy9DLElBQUksRUFBRSxJQUFJLEVBQUUsR0FBRyxTQUFTLENBQUM7UUFDekIsSUFBSSxPQUFPLEdBQUcsTUFBTSxDQUFDLE9BQU8sSUFBSSxJQUFJLEdBQUcsRUFBRSxHQUFHLEdBQUcsQ0FBQztRQUNoRCxHQUFHO1lBQ0QsSUFBSSxLQUFLLEVBQUU7Z0JBQ1QsT0FBTyxTQUFTLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsTUFBTSxrQkFBSSxrQkFBa0IsRUFBRSxLQUFLLElBQUssTUFBTSxFQUFHLENBQUM7YUFDeEY7WUFDRCxJQUFJLENBQUMsS0FBSyxFQUFFO2dCQUNWLElBQUksQ0FBRSxRQUFRLENBQUUsR0FBRyxNQUFNLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUNsRCxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssR0FBRyxRQUFRLENBQUM7YUFDL0I7WUFDRCxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxHQUFHLEtBQUssQ0FBQztZQUN6QixJQUFJLEtBQUssR0FBRyxJQUFJLDJCQUFlLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7WUFDcEQsV0FBRyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztZQUNuQixJQUFJLEdBQUcsR0FBRyxTQUFTLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsTUFBTSxrQkFBSSxrQkFBa0IsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLE9BQU8sSUFBSyxNQUFNLEVBQUcsQ0FBQztZQUMxRyxJQUFJLE1BQU0sQ0FBQztZQUNYLElBQUk7Z0JBQ0YsSUFBSSxPQUFPLEVBQUU7b0JBQ1gsTUFBTSxHQUFHLE1BQU0sT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxZQUFJLENBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsTUFBTSxJQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUMsMEJBQTBCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDL0csT0FBTyxNQUFNLENBQUM7aUJBQ2Y7cUJBQU07b0JBQ0wsT0FBTyxNQUFNLEdBQUcsQ0FBQztpQkFDbEI7YUFDRjtZQUFDLE9BQU8sS0FBSyxFQUFFO2dCQUNkLEtBQUssR0FBRyxJQUFJLENBQUM7Z0JBQ2IsTUFBTSxHQUFHLElBQUksQ0FBQyxDQUFFLGdEQUFnRDtnQkFDaEUsV0FBRyxDQUFDLDRCQUE0QixFQUFFLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQzthQUNuRDtTQUNGLFFBQVEsQ0FBQyxNQUFNLEVBQUU7SUFDcEIsQ0FBQztJQUNELEtBQUssQ0FBQyxNQUFNO1FBQ1YsSUFBSSxFQUFFLElBQUksRUFBRSxHQUFHLFNBQVMsQ0FBQztRQUN6QixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksaUJBQUssRUFBRSxDQUFDO1FBQzdCLElBQUksQ0FBQyxLQUFLLEdBQUcsTUFBTSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUM5QyxDQUFDOztBQTdDTSxtQkFBUyxHQUFHLEVBQUUsQ0FBQztBQUNmLGNBQUksR0FBRyxJQUFJLG1CQUFTLEVBQUUsQ0FBQztBQUZoQyw0QkErQ0MifQ==