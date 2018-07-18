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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL3JlcXVlc3QvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxzREFBeUI7QUFDekIsb0NBQStCO0FBRS9CO0lBOERFLFlBQStCLFVBQWtCLEVBQUUsRUFBWSxPQUFPLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRTtRQUFyRCxZQUFPLEdBQVAsT0FBTyxDQUFhO1FBQVksU0FBSSxHQUFKLElBQUksQ0FBaUI7UUFKcEUsUUFBRyxHQUFXLGlCQUFFLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBRSxZQUFZO1FBQzlDLFNBQUksR0FBVSxFQUFFLENBQUM7SUFHK0QsQ0FBQztJQTdEeEYsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFXLEVBQUUsT0FBWSxFQUFFLEVBQUUsU0FBaUIsS0FBSyxFQUFFLFNBQWMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFO1FBQzlGLE1BQU0sR0FBRyxHQUFXO1lBQ2xCLE1BQU0sRUFBRSxHQUFHO1lBQ1gsT0FBTyxFQUFFO2dCQUNQLFlBQVksRUFBRSwySUFBMkk7YUFDMUo7U0FFRixDQUFBO1FBRUQsUUFBUSxNQUFNLENBQUMsV0FBVyxFQUFFLEVBQUU7WUFDNUIsS0FBSyxLQUFLO2dCQUNOLE1BQU0sQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDO2dCQUNqQixNQUFNLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQztnQkFDMUIsTUFBTTtZQUNOLEtBQUssT0FBTyxDQUFDO1lBQ2IsS0FBSyxNQUFNLENBQUM7WUFDWixLQUFLLEtBQUssQ0FBQztZQUNYO2dCQUNFLE1BQU0sQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO2dCQUNuQixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRTtvQkFDaEIsTUFBTSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7aUJBQ3BCO2dCQUNILE1BQU07U0FDVDtRQUVELElBQUksTUFBTSxH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