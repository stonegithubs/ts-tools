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
            proxy: 'http://chosan.cn:12345'
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
            console.log(uri, body, method, params);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL3JlcXVlc3QvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxzRUFBaUM7QUFFakM7SUFtQ0U7UUFKZ0IsUUFBRyxHQUFXLHlCQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBRSxZQUFZO1FBQzlDLFNBQUksR0FBVSxFQUFFLENBQUM7UUFJdEIsRUFBRTtJQUNKLENBQUM7SUFwQ0QsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFXLEVBQUUsT0FBWSxFQUFFLEVBQUUsU0FBaUIsS0FBSyxFQUFFLFNBQWMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFO1FBQzlGLE1BQU0sR0FBRyxHQUFXO1lBQ2xCLE1BQU0sRUFBRSxHQUFHO1lBQ1gsT0FBTyxFQUFFO2dCQUNQLFlBQVksRUFBRSwySUFBMkk7YUFDMUo7WUFDRCxLQUFLLEVBQUUsd0JBQXdCO1NBQ2hDLENBQUE7UUFFRCxRQUFRLE1BQU0sQ0FBQyxXQUFXLEVBQUUsRUFBRTtZQUM1QixLQUFLLEtBQUs7Z0JBQ04sTUFBTSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUM7Z0JBQ2pCLE1BQU0sQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDO2dCQUMxQixNQUFNO1lBQ04sS0FBSyxPQUFPLENBQUM7WUFDYixLQUFLLE1BQU0sQ0FBQztZQUNaLEtBQUssS0FBSyxDQUFDO1lBQ1g7Z0JBQ0UsTUFBTSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7Z0JBQ25CLE1BQU0sQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO2dCQUNyQixNQUFNO1NBQ1Q7UUFFRCxPQUFPLHlCQUFFLG1CQUFNLEdBQUcsRUFBSyxNQUFNLEVBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDMUMsT0FBTyxHQUFHLENBQUM7UUFDYixDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDZixPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQ3ZDLE9BQU8sQ0FBQyxLQUFLLENBQUMsbUJBQW1CLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3BELENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQVNELEtBQUssQ0FBQyxRQUFRLENBQUMsR0FBVyxFQUFFLE9BQWUsRUFBRSxFQUFFLFNBQWlCLEtBQUssRUFBRSxTQUFjLEVBQUU7UUFDckYsSUFBSSxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsR0FBRyxJQUFJLENBQUM7UUFDMUIsTUFBTSxPQUFPLHFCQUFRLE1BQU0sSUFBRSxHQUFHLEVBQUUsS0FBSyxHQUFFLENBQUM7UUFDMUMsSUFBSTtZQUNGLElBQUksUUFBUSxHQUFHLE1BQU0sS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztZQUMvRCxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUMxQjtRQUFDLE9BQU8sS0FBSyxFQUFFO1lBQ2QsT0FBTyxDQUFDLEtBQUssQ0FBQyxvQkFBb0IsRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDcEQ7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFDRCxRQUFRLENBQUUsS0FBYTtRQUNyQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztJQUNyQixDQUFDO0NBQ0Y7QUFyREQsd0JBcURDIn0=