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
            console.log(uri, body, method, params);
            console.error('Req#getJson 错误:\t', error.message);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL3JlcXVlc3QvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxzREFBeUI7QUFFekI7SUFrREUsWUFBK0IsVUFBa0IsRUFBRSxFQUFZLE9BQU8sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFO1FBQXJELFlBQU8sR0FBUCxPQUFPLENBQWE7UUFBWSxTQUFJLEdBQUosSUFBSSxDQUFpQjtRQUpwRSxRQUFHLEdBQVcsaUJBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFFLFlBQVk7UUFDOUMsU0FBSSxHQUFVLEVBQUUsQ0FBQztJQUcrRCxDQUFDO0lBakR4RixNQUFNLENBQUMsT0FBTyxDQUFDLEdBQVcsRUFBRSxPQUFZLEVBQUUsRUFBRSxTQUFpQixLQUFLLEVBQUUsU0FBYyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUU7UUFDOUYsTUFBTSxHQUFHLEdBQVc7WUFDbEIsTUFBTSxFQUFFLEdBQUc7WUFDWCxPQUFPLEVBQUU7Z0JBQ1AsWUFBWSxFQUFFLDJJQUEySTthQUMxSjtZQUNELEtBQUssRUFBRSx3QkFBd0I7U0FDaEMsQ0FBQTtRQUVELFFBQVEsTUFBTSxDQUFDLFdBQVcsRUFBRSxFQUFFO1lBQzVCLEtBQUssS0FBSztnQkFDTixNQUFNLENBQUMsRUFBRSxHQUFHLElBQUksQ0FBQztnQkFDakIsTUFBTSxDQUFDLElBQUksR0FBRyxTQUFTLENBQUM7Z0JBQzFCLE1BQU07WUFDTixLQUFLLE9BQU8sQ0FBQztZQUNiLEtBQUssTUFBTSxDQUFDO1lBQ1osS0FBSyxLQUFLLENBQUM7WUFDWDtnQkFDRSxNQUFNLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztnQkFDbkIsTUFBTSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7Z0JBQ3JCLE1BQU07U0FDVDtRQUVELElBQUksTUFBTSxHQUFHLElBQUksT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFO1lBQ3BDLGlCQUFFLG1CQUFNLEdBQUcsRUFBSyxNQUFNLEdBQUksQ0FBQyxHQUFHLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxFQUFFO2dCQUNoRCxJQUFJLEdBQUcsRUFBRTtvQkFDUCxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7aUJBQ1Y7cUJBQU07b0JBQ0wsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO2lCQUNYO1lBQ0gsQ0FBQyxDQUFDLENBQUE7UUFDSixDQUFDLENBQUMsQ0FBQTtRQUVGLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDbkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztZQUN2QyxPQUFPLENBQUMsS0FBSyxDQUFDLG1CQUFtQixFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNwRCxDQUFDLENBQUMsQ0FBQztRQUVILE9BQU8sTUFBTSxDQUFDO0lBQ2hCLENBQUM7SUFDRCxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQVcsRUFBRSxPQUFZLEVBQUUsRUFBRSxTQUFpQixLQUFLLEVBQUUsU0FBYyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUU7UUFDOUYsSUFBSSxNQUFNLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztRQUN0RCxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxPQUFPLElBQUksS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2pGLENBQUM7SUFRRCxLQUFLLENBQUMsUUFBUSxDQUFDLEdBQVcsRUFBRSxPQUFlLEVBQUUsRUFBRSxTQUFpQixLQUFLLEVBQUUsU0FBYyxFQUFFO1FBQ3JGLElBQUksRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsR0FBRyxJQUFJLENBQUM7UUFDekMsTUFBTSxPQUFPLHFCQUFRLE1BQU0sSUFBRSxHQUFHLEVBQUUsS0FBSyxHQUFFLENBQUM7UUFDMUMsSUFBSTtZQUNGLElBQUksUUFBUSxHQUFHLE1BQU0sS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxHQUFHLEdBQUcsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQ3JILElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3pCLE9BQU8sUUFBUSxDQUFDO1NBQ2pCO1FBQUMsT0FBTyxLQUFLLEVBQUU7WUFDZCxPQUFPLENBQUMsS0FBSyxDQUFDLG9CQUFvQixFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNuRCxNQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDZDtJQUNILENBQUM7SUFDRCxRQUFRLENBQUUsS0FBYTtRQUNyQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztJQUNyQixDQUFDO0NBQ0Y7QUFuRUQsd0JBbUVDIn0=