"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_1 = __importDefault(require("request"));
const utils_1 = require("../utils");
class MyReq {
    constructor(baseURL = '', conf = { json: true }) {
        this.baseURL = baseURL;
        this.conf = conf;
        this.jar = request_1.default.jar(); // 保存 cookie
        this.data = [];
    }
    static getData(uri, body = {}, method = 'GET', params = { json: true }) {
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
                if (!params.json) {
                    params.form = body;
                }
                break;
        }
        let result = new Promise((res, rej) => {
            request_1.default(Object.assign({}, opt, params), (err, response, data) => {
                if (err) {
                    rej(err);
                }
                else {
                    res(data);
                }
            });
        });
        result.catch(error => {
            console.error(uri, body, method, params);
            console.error('Req#getJson 错误:\t', error.message);
            throw error;
        });
        return result;
    }
    static getJson(uri, body = {}, method = 'GET', params = { json: true }) {
        let result = MyReq.getData(uri, body, method, params);
        return result.then(data => {
            console.log(data);
            let jsonData;
            try {
                jsonData = typeof data === 'string' ? JSON.parse(data) : data;
            }
            catch (error) {
                utils_1.log('Req#JSON解析错误！', error, 'error');
            }
            return jsonData || data;
        });
    }
    async workFlow(uri, data = {}, method = 'GET', params = {}) {
        let { conf: { json }, baseURL, jar, proxy } = this;
        const oParams = Object.assign({ json }, params, { jar, proxy });
        try {
            let response = await MyReq[(oParams.json) ? 'getJson' : 'getData'](baseURL + uri, data, method, oParams);
            this.data.push(response);
            return response;
        }
        catch (error) {
            console.error('Req#workFlow 错误:\t', error.message);
            throw (error);
        }
    }
    setProxy(proxy) {
        this.proxy = proxy;
    }
}
exports.default = MyReq;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL3JlcXVlc3QvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxzREFBeUI7QUFDekIsb0NBQStCO0FBRS9CO0lBOERFLFlBQStCLFVBQWtCLEVBQUUsRUFBWSxPQUFPLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRTtRQUFyRCxZQUFPLEdBQVAsT0FBTyxDQUFhO1FBQVksU0FBSSxHQUFKLElBQUksQ0FBaUI7UUFKcEUsUUFBRyxHQUFXLGlCQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBRSxZQUFZO1FBQzlDLFNBQUksR0FBVSxFQUFFLENBQUM7SUFHK0QsQ0FBQztJQTdEeEYsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFXLEVBQUUsT0FBWSxFQUFFLEVBQUUsU0FBaUIsS0FBSyxFQUFFLFNBQWMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFO1FBQzlGLE1BQU0sR0FBRyxHQUFXO1lBQ2xCLE1BQU0sRUFBRSxHQUFHO1lBQ1gsT0FBTyxFQUFFO2dCQUNQLFlBQVksRUFBRSwySUFBMkk7YUFDMUo7WUFDRCxLQUFLLEVBQUUsd0JBQXdCO1NBQ2hDLENBQUE7UUFFRCxRQUFRLE1BQU0sQ0FBQyxXQUFXLEVBQUUsRUFBRTtZQUM1QixLQUFLLEtBQUs7Z0JBQ04sTUFBTSxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUM7Z0JBQ2pCLE1BQU0sQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDO2dCQUMxQixNQUFNO1lBQ04sS0FBSyxPQUFPLENBQUM7WUFDYixLQUFLLE1BQU0sQ0FBQztZQUNaLEtBQUssS0FBSyxDQUFDO1lBQ1g7Z0JBQ0UsTUFBTSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7Z0JBQ25CLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFO29CQUNoQixNQUFNLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztpQkFDcEI7Z0JBQ0gsTUFB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