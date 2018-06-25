"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_promise_1 = __importDefault(require("request-promise"));
class MyReq {
    constructor() {
        this.jar = request_promise_1.default.jar(); // 保存 cookie
        this.data = [];
        //
    }
    static getJson(uri, body = {}, method = 'GET', params = { json: true }) {
        const opt = {
            method, uri,
            headers: {
                'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1'
            },
        };
        switch (method.toLowerCase()) {
            case 'get':
                params.qs = body;
                params.form = undefined;
                break;
            case 'patch':
            case 'post':
            case 'put':
            default:
                params.body = body;
                params.form = body;
                break;
        }
        return request_promise_1.default(Object.assign({}, opt, params)).then(res => {
            return res;
        }).catch(error => {
            console.error('Req#getJson 错误:\t', error.message);
        });
    }
    async workFlow(uri, data = {}, method = 'GET', params = {}) {
        let { jar, proxy } = this;
        const oParams = Object.assign({}, params, { jar, proxy });
        try {
            let response = await MyReq.getJson(uri, data, method, oParams);
            this.data.push(response);
        }
        catch (error) {
            console.error('Req#workFlow 错误:\t', error.message);
        }
        return this;
    }
    setProxy(proxy) {
        this.proxy = proxy;
    }
}
exports.default = MyReq;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL3JlcXVlc3QvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxzRUFBaUM7QUFFakM7SUFrQ0U7UUFKZ0IsUUFBRyxHQUFXLHlCQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBRSxZQUFZO1FBQzlDLFNBQUksR0FBVSxFQUFFLENBQUM7UUFJdEIsRUFBRTtJQUNKLENBQUM7SUFuQ0QsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFXLEVBQUUsT0FBZSxFQUFFLEVBQUUsU0FBaUIsS0FBSyxFQUFFLFNBQWMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFO1FBQ2pHLE1BQU0sR0FBRyxHQUFXO1lBQ2xCLE1BQU0sRUFBRSxHQUFHO1lBQ1gsT0FBTyxFQUFFO2dCQUNQLFlBQVksRUFBRSwySUFBMkk7YUFDMUo7U0FFRixDQUFBO1FBRUQsUUFBUSxNQUFNLENBQUMsV0FBVyxFQUFFLEVBQUU7WUFDNUIsS0FBSyxLQUFLO2dCQUNOLE1BQU0sQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDO2dCQUNqQixNQUFNLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQztnQkFDMUIsTUFBTTtZQUNOLEtBQUssT0FBTyxDQUFDO1lBQ2IsS0FBSyxNQUFNLENBQUM7WUFDWixLQUFLLEtBQUssQ0FBQztZQUNYO2dCQUNFLE1BQU0sQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO2dCQUNuQixNQUFNLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztnQkFDckIsTUFBTTtTQUNUO1FBRUQsT0FBTyx5QkFBRSxtQkFBTSxHQUFHLEVBQUssTUFBTSxFQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQzFDLE9BQU8sR0FBRyxDQUFDO1FBQ2IsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ2YsT0FBTyxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDcEQsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBU0QsS0FBSyxDQUFDLFFBQVEsQ0FBQyxHQUFXLEVBQUUsT0FBZSxFQUFFLEVBQUUsU0FBaUIsS0FBSyxFQUFFLFNBQWMsRUFBRTtRQUNyRixJQUFJLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxHQUFHLElBQUksQ0FBQztRQUMxQixNQUFNLE9BQU8scUJBQVEsTUFBTSxJQUFFLEdBQUcsRUFBRSxLQUFLLEdBQUUsQ0FBQztRQUMxQyxJQUFJO1lBQ0YsSUFBSSxRQUFRLEdBQUcsTUFBTSxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQy9ELElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQzFCO1FBQUMsT0FBTyxLQUFLLEVBQUU7WUFDZCxPQUFPLENBQUMsS0FBSyxDQUFDLG9CQUFvQixFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUNwRDtRQUNELE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUNELFFBQVEsQ0FBRSxLQUFhO1FBQ3JCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0lBQ3JCLENBQUM7Q0FDRjtBQXBERCx3QkFvREMifQ==