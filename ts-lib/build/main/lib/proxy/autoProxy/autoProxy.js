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
    constructor(strict = false) {
        this.strict = strict;
        this.requester = new request_1.default();
    }
    async send(url, data = {}, method = 'get', params = {}) {
        let { proxy, strict, requester } = this;
        let { pool } = AutoProxy;
        let timeout = params.timeout || 1000 * 60 * 4;
        do {
            if (!proxy) {
                let [proxyUrl] = await pool.getProxies(1, true);
                this.proxy = proxy = proxyUrl;
            }
            let { ip, port } = proxy;
            let agent = new https_proxy_agent_1.default({ host: ip, port });
            utils_1.log('使用代理', proxy);
            let req = requester.workFlow(url, data, method, Object.assign({ rejectUnauthorized: false, agent }, params));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0b1Byb3h5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2xpYi9wcm94eS9hdXRvUHJveHkvYXV0b1Byb3h5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsNERBQWtDO0FBRWxDLHVFQUErQztBQUMvQywwRUFBZ0QsQ0FBQyw4QkFBOEI7QUFDL0UsdUNBQW9EO0FBRXBEO0lBS0Usa0VBQWtFO0lBQ2xFLFlBQW1CLFNBQVMsS0FBSztRQUFkLFdBQU0sR0FBTixNQUFNLENBQVE7UUFIakMsY0FBUyxHQUFHLElBQUksaUJBQUssRUFBRSxDQUFDO0lBR1ksQ0FBQztJQUNyQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLEdBQUcsRUFBRSxFQUFFLE1BQU0sR0FBRyxLQUFLLEVBQUUsU0FBYyxFQUFFO1FBQ3pELElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxHQUFHLElBQUksQ0FBQztRQUN4QyxJQUFJLEVBQUUsSUFBSSxFQUFFLEdBQUcsU0FBUyxDQUFDO1FBQ3pCLElBQUksT0FBTyxHQUFHLE1BQU0sQ0FBQyxPQUFPLElBQUksSUFBSSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDOUMsR0FBRztZQUNELElBQUksQ0FBQyxLQUFLLEVBQUU7Z0JBQ1YsSUFBSSxDQUFFLFFBQVEsQ0FBRSxHQUFHLE1BQU0sSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQ2xELElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxHQUFHLFFBQVEsQ0FBQzthQUMvQjtZQUNELElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEdBQUcsS0FBSyxDQUFDO1lBQ3pCLElBQUksS0FBSyxHQUFHLElBQUksMkJBQWUsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztZQUNwRCxXQUFHLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ25CLElBQUksR0FBRyxHQUFHLFNBQVMsQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxNQUFNLGtCQUFJLGtCQUFrQixFQUFFLEtBQUssRUFBRSxLQUFLLElBQUssTUFBTSxFQUFHLENBQUM7WUFDakcsSUFBSSxNQUFNLENBQUM7WUFDWCxJQUFJO2dCQUNGLElBQUksT0FBTyxFQUFFO29CQUNYLE1BQU0sR0FBRyxNQUFNLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsWUFBSSxDQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLE1BQU0sSUFBSSxPQUFPLENBQUMsTUFBTSxDQUFDLDBCQUEwQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQy9HLE9BQU8sTUFBTSxDQUFDO2lCQUNmO3FCQUFNO29CQUNMLE9BQU8sTUFBTSxHQUFHLENBQUM7aUJBQ2xCO2FBQ0Y7WUFBQyxPQUFPLEtBQUssRUFBRTtnQkFDZCxLQUFLLEdBQUcsSUFBSSxDQUFDO2dCQUNiLE1BQU0sR0FBRyxJQUFJLENBQUMsQ0FBRSxnREFBZ0Q7Z0JBQ2hFLFdBQUcsQ0FBQyw0QkFBNEIsRUFBRSxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7YUFDbkQ7U0FDRixRQUFRLENBQUMsTUFBTSxFQUFFO0lBQ3BCLENBQUM7SUFDRCxLQUFLLENBQUMsTUFBTTtRQUNWLElBQUksRUFBRSxJQUFJLEVBQUUsR0FBRyxTQUFTLENBQUM7UUFDekIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLGlCQUFLLEVBQUUsQ0FBQztRQUM3QixJQUFJLENBQUMsS0FBSyxHQUFHLE1BQU0sSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDOUMsQ0FBQzs7QUF0Q00sbUJBQVMsR0FBRyxFQUFFLENBQUM7QUFDZixjQUFJLEdBQUcsSUFBSSxtQkFBUyxFQUFFLENBQUM7QUFGaEMsNEJBd0NDIn0=