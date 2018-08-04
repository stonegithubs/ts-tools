"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_1 = __importDefault(require("../../request"));
const utils_1 = require("../../utils");
class ProxyPool {
    constructor() {
        this.requester = new request_1.default();
        this.isUpdating = false;
        let { instance } = ProxyPool;
        return ProxyPool.instance = instance || this;
    }
    /**
     * @param  {} count=1 获取代理数量
     * @param  {} origin=false 该字段为 true 时取得的是原始数据, 为 false 时获得拼接好的代理 url 字符串
     * @param  {} downward=true 如果代理余量小于获取量时, 该字段为 false, 则抛出 'lack of proxies' 异常
     */
    async getProxies(count = 1, origin = false, downward = true) {
        let { proxies } = ProxyPool;
        let ret = [];
        await utils_1.check(() => !this.isUpdating);
        if (proxies.length < count) {
            await this.updateProxies();
        }
        while (count--) {
            let proxy = proxies.shift();
            if (proxy) {
                let { ip, protocol, port } = proxy;
                let data = origin ? proxy : `${protocol}://${ip}:${port}`;
                ret.push(data);
            }
            else {
                downward || utils_1.throwError({ status: 0, message: 'lack of proxies' });
            }
        }
        return ret;
    }
    async updateProxies(params = {}) {
        let { requester } = this;
        let { domains } = ProxyPool;
        let domain = domains.shift();
        domains.push(domain);
        this.isUpdating = true;
        let result = await requester.workFlow(`http://${domain}:26670/proxies?u=lakdf%3Bllkjqw23134lk12j%3BL%3AKJFDLK%23%3ALEJE)(*_(_)%23&p=askdfkjllskfdj23lk4jl%3B12341lk2jl241234ljk12l`, Object.assign({ count: 10000 }, params), 'get', { json: true });
        if (result.status && result.data.length) {
            [].push.apply(ProxyPool.proxies, result.data);
        }
        else {
            utils_1.throwError({
                status: 0,
                message: result.msg || 'no more proxies'
            });
        }
        this.isUpdating = false;
    }
}
ProxyPool.domains = ['chosan.cn', 'mlo.kim', 'hk.static.kim'];
ProxyPool.proxies = [];
exports.default = ProxyPool;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJveHlQb29sLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2xpYi9wcm94eS9wcm94eVBvb2wvcHJveHlQb29sLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQ0EsNERBQWtDO0FBQ2xDLHVDQUE2RDtBQUU3RDtJQU1FO1FBRkEsY0FBUyxHQUFHLElBQUksaUJBQUssRUFBRSxDQUFDO1FBQ3hCLGVBQVUsR0FBRyxLQUFLLENBQUM7UUFFakIsSUFBSSxFQUFFLFFBQVEsRUFBRSxHQUFHLFNBQVMsQ0FBQztRQUM3QixPQUFPLFNBQVMsQ0FBQyxRQUFRLEdBQUcsUUFBcUIsSUFBSSxJQUFJLENBQUM7SUFDNUQsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxLQUFLLENBQUMsVUFBVSxDQUFDLEtBQUssR0FBRyxDQUFDLEVBQUUsTUFBTSxHQUFHLEtBQUssRUFBRSxRQUFRLEdBQUcsSUFBSTtRQUN6RCxJQUFJLEVBQUUsT0FBTyxFQUFFLEdBQUcsU0FBUyxDQUFDO1FBQzVCLElBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQztRQUNiLE1BQU0sYUFBSyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ3BDLElBQUksT0FBTyxDQUFDLE1BQU0sR0FBRyxLQUFLLEVBQUU7WUFDMUIsTUFBTSxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7U0FDNUI7UUFDRCxPQUFNLEtBQUssRUFBRSxFQUFFO1lBQ2IsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQzVCLElBQUksS0FBSyxFQUFFO2dCQUNULElBQUksRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxHQUFHLEtBQUssQ0FBQztnQkFDbkMsSUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsUUFBUSxNQUFNLEVBQUUsSUFBSSxJQUFJLEVBQUUsQ0FBQztnQkFDMUQsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUNoQjtpQkFBTTtnQkFDTCxRQUFRLElBQUksa0JBQVUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLENBQUMsQ0FBQzthQUNuRTtTQUNGO1FBQ0QsT0FBTyxHQUFHLENBQUM7SUFDYixDQUFDO0lBRUQsS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEdBQUcsRUFBRTtRQUM3QixJQUFJLEVBQUUsU0FBUyxFQUFFLEdBQUcsSUFBSSxDQUFDO1FBQ3pCLElBQUksRUFBRSxPQUFPLEVBQUUsR0FBRyxTQUFTLENBQUM7UUFDNUIsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQzdCLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDckIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7UUFDdkIsSUFBSSxNQUFNLEdBQUcsTUFBTSxTQUFTLENBQUMsUUFBUSxDQUFDLFVBQVUsTUFBTSw2SEFBNkgsa0JBQ2pMLEtBQUssRUFBRSxLQUFLLElBR1QsTUFBTSxHQUNSLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQzFCLElBQUksTUFBTSxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUN2QyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUMvQzthQUFNO1lBQ0wsa0JBQVUsQ0FBQztnQkFDVCxNQUFNLEVBQUUsQ0FBQztnQkFDVCxPQUFPLEVBQUUsTUFBTSxDQUFDLEdBQUcsSUFBSSxpQkFBaUI7YUFDekMsQ0FBQyxDQUFDO1NBQ0o7UUFDRCxJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQztJQUMxQixDQUFDOztBQXZETSxpQkFBTyxHQUFHLENBQUMsV0FBVyxFQUFFLFNBQVMsRUFBRSxlQUFlLENBQUMsQ0FBQztBQUNwRCxpQkFBTyxHQUFHLEVBQUUsQ0FBQztBQUh0Qiw0QkEwREMifQ==