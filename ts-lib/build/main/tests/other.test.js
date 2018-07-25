"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_1 = __importDefault(require("../lib/request"));
const https_proxy_agent_1 = __importDefault(require("https-proxy-agent")); // https 代理, 用于添加 connection 头
let agent = new https_proxy_agent_1.default({ host: '170.238.61.148', port: '53281' });
request_1.default.getJson('http://httpbin.org/ip', {}, 'get', {
    // proxy: 'https://170.238.61.148:53281',
    rejectUnauthorized: false,
    agent,
    headers: {
        Connection: 'keep-alive',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'Cache-Control': 'no-cache',
        Host: 'httpbin.org',
        Pragma: 'no-cache',
        'Proxy-Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': 1,
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36'
    }
}).then(data => {
    console.log(data);
}, err => {
    console.log(err);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3RoZXIudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy90ZXN0cy9vdGhlci50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsNkRBQW1DO0FBRW5DLDBFQUFnRCxDQUFDLDhCQUE4QjtBQUkvRSxJQUFJLEtBQUssR0FBRyxJQUFJLDJCQUFlLENBQUMsRUFBRSxJQUFJLEVBQUMsZ0JBQWdCLEVBQUUsSUFBSSxFQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7QUFFekUsaUJBQUssQ0FBQyxPQUFPLENBQUMsdUJBQXVCLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRTtJQUNoRCx5Q0FBeUM7SUFDekMsa0JBQWtCLEVBQUUsS0FBSztJQUN6QixLQUFLO0lBQ0wsT0FBTyxFQUFFO1FBQ1AsVUFBVSxFQUFFLFlBQVk7UUFDeEIsTUFBTSxFQUFFLHVGQUF1RjtRQUMvRixpQkFBaUIsRUFBRSxlQUFlO1FBQ2xDLGlCQUFpQixFQUFFLHlCQUF5QjtRQUM1QyxlQUFlLEVBQUUsVUFBVTtRQUMzQixJQUFJLEVBQUUsYUFBYTtRQUNuQixNQUFNLEVBQUUsVUFBVTtRQUNsQixrQkFBa0IsRUFBRSxZQUFZO1FBQ2hDLDJCQUEyQixFQUFFLENBQUM7UUFDOUIsWUFBWSxFQUFFLDBIQUEwSDtLQUN6STtDQUNGLENBQUMsQ0FBQyxJQUFJLENBQ0wsSUFBSSxDQUFDLEVBQUU7SUFDTCxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3BCLENBQUMsRUFDRCxHQUFHLENBQUMsRUFBRTtJQUNKLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDbkIsQ0FBQyxDQUNGLENBQUMifQ==