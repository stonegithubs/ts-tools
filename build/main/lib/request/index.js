"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_1 = __importDefault(require("request"));
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
                params.form = body;
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
        return result.then(data => typeof data === 'string' ? JSON.parse(data) : data);
    }
    async workFlow(uri, data = {}, method = 'GET', params = {}) {
        let { conf, baseURL, jar, proxy } = this;
        const oParams = Object.assign({}, params, { jar, proxy });
        try {
            let response = await MyReq[(params.json || conf.json) ? 'getJson' : 'getData'](baseURL + uri, data, method, oParams);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL3JlcXVlc3QvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxzREFBeUI7QUFFekI7SUFtREUsWUFBK0IsVUFBa0IsRUFBRSxFQUFZLE9BQU8sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFO1FBQXJELFlBQU8sR0FBUCxPQUFPLENBQWE7UUFBWSxTQUFJLEdBQUosSUFBSSxDQUFpQjtRQUpwRSxRQUFHLEdBQVcsaUJBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFFLFlBQVk7UUFDOUMsU0FBSSxHQUFVLEVBQUUsQ0FBQztJQUcrRCxDQUFDO0lBbER4RixNQUFNLENBQUMsT0FBTyxDQUFDLEdBQVcsRUFBRSxPQUFZLEVBQUUsRUFBRSxTQUFpQixLQUFLLEVBQUUsU0FBYyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUU7UUFDOUYsTUFBTSxHQUFHLEdBQVc7WUFDbEIsTUFBTSxFQUFFLEdBQUc7WUFDWCxPQUFPLEVBQUU7Z0JBQ1AsWUFBWSxFQUFFLDJJQUEySTthQUMxSjtZQUNELEtBQUssRUFBRSx3QkFBd0I7U0FDaEMsQ0FBQTtRQUVELFFBQVEsTUFBTSxDQUFDLFdBQVcsRUFBRSxFQUFFO1lBQzVCLEtBQUssS0FBSztnQkFDTixNQUFNLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQztnQkFDakIsTUFBTSxDQUFDLElBQUksR0FBRyxTQUFTLENBQUM7Z0JBQzFCLE1BQU07WUFDTixLQUFLLE9BQU8sQ0FBQztZQUNiLEtBQUssTUFBTSxDQUFDO1lBQ1osS0FBSyxLQUFLLENBQUM7WUFDWDtnQkFDRSxNQUFNLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztnQkFDbkIsTUFBTSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7Z0JBQ3JCLE1BQU07U0FDVDtRQUVELElBQUksTUFBTSxHQUFHLElBQUksT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFF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