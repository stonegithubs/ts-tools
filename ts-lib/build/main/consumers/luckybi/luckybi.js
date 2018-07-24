"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = __importDefault(require("ioredis"));
const request_1 = __importDefault(require("request"));
const chaojiying_1 = __importDefault(require("../../lib/chaojiying"));
const mongo_1 = __importDefault(require("../../lib/mongo/"));
const xundaili_1 = __importDefault(require("../../lib/proxy/xundaili"));
const dz_1 = __importDefault(require("../../lib/SMS/dz/"));
const utils_1 = require("../../lib/utils");
const request_2 = __importDefault(require("../../lib/request"));
//  --------- redis ---------
const redis = new ioredis_1.default({ host: 'mlo.kim', password: '199381' });
redis.subscribe('mailReceived', (err, count) => err ? utils_1.throwError(err.message) : utils_1.log(`当前第 ${count} 位订阅 mailReceived 的用户`));
//  --------- 超级鹰 ---------
const cjy = new chaojiying_1.default('179817004', 'Mailofchaojiying*', '896776');
//  --------- DZ ---------
const dz = new dz_1.default('zhang179817004', 'qq179817004*', '46021');
//  --------- XunDaili ---------
const xdl = new xundaili_1.default({ orderno: 'ZF20187249103GcJiAA', secret: 'f7691def90804df3ba830c1a1308a718' }); // ZF2018744533NVHTc0 ZF20187249103GcJiAA
//  --------- MongoDB ---------
const mongo = new mongo_1.default();
class LUCKYBI {
    constructor(inviteCode) {
        this.inviteCode = inviteCode;
        this.baseURL = 'http://www.luckybi.io';
        this.requester = new request_2.default('http://www.luckybi.io', { json: false });
        this.headers = {
            Host: 'www.luckybi.io',
            Referer: `http://www.luckybi.io/register?code=${this.inviteCode}`,
            user_timezone: 8,
            'User-Agent': utils_1.randomUA()
        };
        this.jar = request_1.default.jar();
    }
    async getData(url, data, method = 'get', params) {
        let { requester, headers } = this;
        let oParams = Object.assign({ headers }, params);
        return requester.workFlow(url, data, method, xdl.wrapParams(oParams));
    }
    async getHTML() {
        return this.getData(`/register?code=${this.inviteCode}`);
    }
    async getCaptchaId() {
        return this.getData('/auth/find/captchaId', {}, 'post');
    }
    async task() {
        await this.getHTML();
        return this.getCaptchaId();
    }
}
exports.default = LUCKYBI;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibHVja3liaS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb25zdW1lcnMvbHVja3liaS9sdWNreWJpLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsc0RBQTRCO0FBQzVCLHNEQUF5QjtBQUN6QixzRUFBOEM7QUFFOUMsNkRBQXFDO0FBQ3JDLHdFQUF1RTtBQUN2RSwyREFBbUM7QUFDbkMsMkNBQThGO0FBRTlGLGdFQUFzQztBQUV0Qyw2QkFBNkI7QUFFN0IsTUFBTSxLQUFLLEdBQUcsSUFBSSxpQkFBSyxDQUFDLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FBQztBQUVqRSxLQUFLLENBQUMsU0FBUyxDQUFFLGNBQWMsRUFBRSxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsa0JBQVUsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQUcsQ0FBQyxPQUFPLEtBQUssdUJBQXVCLENBQUMsQ0FBRSxDQUFDO0FBRTVILDJCQUEyQjtBQUUzQixNQUFNLEdBQUcsR0FBRyxJQUFJLG9CQUFVLENBQUMsV0FBVyxFQUFFLG1CQUFtQixFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBRXZFLDBCQUEwQjtBQUUxQixNQUFNLEVBQUUsR0FBRyxJQUFJLFlBQUUsQ0FBQyxnQkFBZ0IsRUFBRSxjQUFjLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFFN0QsZ0NBQWdDO0FBRWhDLE1BQU0sR0FBRyxHQUFHLElBQUksa0JBQVEsQ0FBQyxFQUFFLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLEVBQUUsa0NBQWtDLEVBQUUsQ0FBQyxDQUFDLENBQUMseUNBQXlDO0FBRW5KLCtCQUErQjtBQUUvQixNQUFNLEtBQUssR0FBRyxJQUFJLGVBQUssRUFBRSxDQUFDO0FBRTFCO0lBVUUsWUFBbUIsVUFBVTtRQUFWLGVBQVUsR0FBVixVQUFVLENBQUE7UUFUN0IsWUFBTyxHQUFHLHVCQUF1QixDQUFDO1FBQ2xDLGNBQVMsR0FBVSxJQUFJLGlCQUFLLENBQUMsdUJBQXVCLEVBQUUsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUN2RSxZQUFPLEdBQUc7WUFDUixJQUFJLEVBQUUsZ0JBQWdCO1lBQ3RCLE9BQU8sRUFBRSx1Q0FBdUMsSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUNqRSxhQUFhLEVBQUUsQ0FBQztZQUNoQixZQUFZLEVBQUUsZ0JBQVEsRUFBRTtTQUN6QixDQUFDO1FBQ0YsUUFBRyxHQUFHLGlCQUFFLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDaUIsQ0FBQztJQUVqQyxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxJQUFLLEVBQUUsTUFBTSxHQUFHLEtBQUssRUFBRSxNQUFPO1FBQy9DLElBQUksRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFLEdBQUcsSUFBSSxDQUFDO1FBQ2xDLElBQUksT0FBTyxtQkFBSyxPQUFPLElBQUssTUFBTSxDQUFFLENBQUM7UUFDckMsT0FBTyxTQUFTLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEdBQUcsQ0FBQyxVQUFVLENBQ3pELE9BQU8sQ0FBQyxDQUNULENBQUM7SUFDSixDQUFDO0lBRUQsS0FBSyxDQUFDLE9BQU87UUFDWCxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsa0JBQWtCLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDO0lBQzNELENBQUM7SUFFRCxLQUFLLENBQUMsWUFBWTtRQUNoQixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsc0JBQXNCLEVBQUUsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQzFELENBQUM7SUFFRCxLQUFLLENBQUMsSUFBSTtRQUNSLE1BQU0sSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ3JCLE9BQU8sSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQzdCLENBQUM7Q0FDRjtBQWhDRCwwQkFnQ0MifQ==