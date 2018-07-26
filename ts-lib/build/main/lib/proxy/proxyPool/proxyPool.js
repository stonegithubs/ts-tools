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
        return instance || this;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJveHlQb29sLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2xpYi9wcm94eS9wcm94eVBvb2wvcHJveHlQb29sLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQ0EsNERBQWtDO0FBQ2xDLHVDQUE2RDtBQUU3RDtJQU1FO1FBRkEsY0FBUyxHQUFHLElBQUksaUJBQUssRUFBRSxDQUFDO1FBQ3hCLGVBQVUsR0FBRyxLQUFLLENBQUM7UUFFakIsSUFBSSxFQUFFLFFBQVEsRUFBRSxHQUFHLFNBQVMsQ0FBQztRQUM3QixPQUFPLFFBQXFCLElBQUksSUFBSSxDQUFDO0lBQ3ZDLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsS0FBSyxDQUFDLFVBQVUsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFFLE1BQU0sR0FBRyxLQUFLLEVBQUUsUUFBUSxHQUFHLElBQUk7UUFDekQsSUFBSSxFQUFFLE9BQU8sRUFBRSxHQUFHLFNBQVMsQ0FBQztRQUM1QixJQUFJLEdBQUcsR0FBRyxFQUFFLENBQUM7UUFDYixNQUFNLGFBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNwQyxJQUFJLE9BQU8sQ0FBQyxNQUFNLEdBQUcsS0FBSyxFQUFFO1lBQzFCLE1BQU0sSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1NBQzVCO1FBQ0QsT0FBTSxLQUFLLEVBQUUsRUFBRTtZQUNiLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUM1QixJQUFJLEtBQUssRUFBRTtnQkFDVCxJQUFJLEVBQUUsRUFBRSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsR0FBRyxLQUFLLENBQUM7Z0JBQ25DLElBQUksSUFBSSxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLFFBQVEsTUFBTSxFQUFFLElBQUksSUFBSSxFQUFFLENBQUM7Z0JBQzFELEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDaEI7aUJBQU07Z0JBQ0wsUUFBUSxJQUFJLGtCQUFVLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxDQUFDLENBQUM7YUFDbkU7U0FDRjtRQUNELE9BQU8sR0FBRyxDQUFDO0lBQ2IsQ0FBQztJQUVELEtBQUssQ0FBQyxhQUFhLENBQUMsTUFBTSxHQUFHLEVBQUU7UUFDN0IsSUFBSSxFQUFFLFNBQVMsRUFBRSxHQUFHLElBQUksQ0FBQztRQUN6QixJQUFJLEVBQUUsT0FBTyxFQUFFLEdBQUcsU0FBUyxDQUFDO1FBQzVCLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUM3QixPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3JCLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO1FBQ3ZCLElBQUksTUFBTSxHQUFHLE1BQU0sU0FBUyxDQUFDLFFBQVEsQ0FBQyxVQUFVLE1BQU0sNkhBQTZILGtCQUNqTCxLQUFLLEVBQUUsS0FBSyxJQUdULE1BQU0sR0FDUixLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUMxQixJQUFJLE1BQU0sQ0FBQyxNQUFNLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDdkMsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDL0M7YUFBTTtZQUNMLGtCQUFVLENBQUM7Z0JBQ1QsTUFBTSxFQUFFLENBQUM7Z0JBQ1QsT0FBTyxFQUFFLE1BQU0sQ0FBQyxHQUFHLElBQUksaUJBQWlCO2FBQ3pDLENBQUMsQ0FBQztTQUNKO1FBQ0QsSUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7SUFDMUIsQ0FBQzs7QUF2RE0saUJBQU8sR0FBRyxDQUFDLFdBQVcsRUFBRSxTQUFTLEVBQUUsZUFBZSxDQUFDLENBQUM7QUFDcEQsaUJBQU8sR0FBRyxFQUFFLENBQUM7QUFIdEIsNEJBMERDIn0=