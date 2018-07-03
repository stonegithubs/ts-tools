"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import Epnex from '../epnex';
const koa_1 = __importDefault(require("../../../lib/koa"));
const request_promise_1 = __importDefault(require("request-promise"));
// let ep = new Epnex();
// ep.task();
new koa_1.default([
    {
        method: 'post', path: '/', cb: (ctx) => {
            console.log(ctx);
        }
    }
]).listen(8889);
let r = request_promise_1.default.post('https://epnex.io/api/emailValidCode', {
    form: `{"user_email":"12314@chosan.cn","PvilidCode":"s7b4r"}`,
    headers: {
        Host: 'epnex.io',
        Origin: 'https://epnex.io',
        Referer: 'https://epnex.io/phoneSelf_sign.html?i=00VHmxY&lan=0',
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1'
    },
    proxy: 'http://chosan.cn:12345'
});
r.on('data', (err, data) => {
    console.log(err, data);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9jb25zdW1lcnMvZXBuZXgvdGVzdHMvdGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLGdDQUFnQztBQUNoQywyREFBbUM7QUFDbkMsc0VBQWlDO0FBR2pDLHdCQUF3QjtBQUV4QixhQUFhO0FBRWIsSUFBSSxhQUFHLENBQUM7SUFDTjtRQUNFLE1BQU0sRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxFQUFFLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRTtZQUNyQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRW5CLENBQUM7S0FDRjtDQUNGLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7QUFFaEIsSUFBSSxDQUFDLEdBQUcseUJBQUUsQ0FBQyxJQUFJLENBQUMscUNBQXFDLEVBQUU7SUFDckQsSUFBSSxFQUFFLHVEQUF1RDtJQUM3RCxPQUFPLEVBQUU7UUFDUCxJQUFJLEVBQUUsVUFBVTtRQUNoQixNQUFNLEVBQUUsa0JBQWtCO1FBQzFCLE9BQU8sRUFBRSxzREFBc0Q7UUFDL0QsWUFBWSxFQUFFLDJJQUEySTtLQUMxSjtJQUNELEtBQUssRUFBRSx3QkFBd0I7Q0FDaEMsQ0FBQyxDQUFBO0FBRUYsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLEVBQUU7SUFDekIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDekIsQ0FBQyxDQUFDLENBQUEifQ==