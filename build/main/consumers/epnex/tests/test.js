"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const epnex_1 = __importDefault(require("../epnex"));
// import rp from 'request-promise';
// import rq from 'request';
// import Koa from '../../../lib/koa';
// import querystring from 'querystring';
let ep = new epnex_1.default('00TPBBT');
ep.task();
// new Koa([
//   {
//     method: 'post', path: '/', cb: (ctx) => {
//       console.log(ctx);
//     }
//   }
// ]).listen(8889);
// let url = 
// 'https://epnex.io/api/emailValidCode'
// let data = JSON.stringify({"user_email":"12314@chosan.cn","PvilidCode":"s7b4r"})
// let r = rq.post(url, {
//   body: data ,
//   headers: {
//     'Content-Length': Buffer.byteLength(data),
//     'Content-Type': 'application/x-www-form-urlencoded',
//     Host: 'epnex.io',
//     Origin: 'https://epnex.io',
//     Referer: 'https://epnex.io/phoneSelf_sign.html?i=00VHmxY&lan=0',
//     'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1'
//   },
//   // proxy: 'http://chosan.cn:12345'
// })
// r.on('data', (err, data) => {
//   console.log(err, data);
// })
// r.then(data => {
//   console.log(data);
// })
// http.request({})
// rp({
//   uri: url,
//   method :'POST',
//   proxy: 'http://chosan.cn:12345',
//   headers: {
//   'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
//   'Host': 'epnex.io',
//   'Origin':' https://epnex.io',
//   'Referer': 'https://epnex.io/phoneSelf_sign.html?i=00VHmxY&lan=0&from=singlemessage',
//   'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1'
//   },
//   form: data
// }
// , 
// (err, response, body) => {
//   console.log(err, response, body);
// }
// ).then(data => {
//   console.log(data);
// }, err => {
//   console.log(err);
// })
// const postData = '{"user_email":"12314@chosan.cn","PvilidCode":"s7b4r"}'// querystring.stringify({"user_email":"12314@chosan.cn","PvilidCode":"s7b4r"});
// const options = {
//   hostname: 'epnex.io',
//   port: 443,
//   path: '/api/emailValidCode',
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/x-www-form-urlencoded',
//     'Content-Length': Buffer.byteLength(postData)
//   }
// };
// const req = https.request(options, (res) => {
//   console.log(`STATUS: ${res.statusCode}`);
//   console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
//   res.setEncoding('utf8');
//   res.on('data', (chunk) => {
//     console.log(`BODY: ${chunk}`);
//   });
//   res.on('end', () => {
//     console.log('No more data in response.');
//   });
// });
// req.on('error', (e) => {
//   console.error(`problem with request: ${e.message}`);
// });
// // write data to request body
// req.write(postData);
// req.end();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9jb25zdW1lcnMvZXBuZXgvdGVzdHMvdGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLHFEQUE2QjtBQUM3QixvQ0FBb0M7QUFDcEMsNEJBQTRCO0FBQzVCLHNDQUFzQztBQUN0Qyx5Q0FBeUM7QUFFekMsSUFBSSxFQUFFLEdBQUcsSUFBSSxlQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7QUFFOUIsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDO0FBRVYsWUFBWTtBQUNaLE1BQU07QUFDTixnREFBZ0Q7QUFDaEQsMEJBQTBCO0FBQzFCLFFBQVE7QUFDUixNQUFNO0FBQ04sbUJBQW1CO0FBRW5CLGFBQWE7QUFDYix3Q0FBd0M7QUFFeEMsbUZBQW1GO0FBRW5GLHlCQUF5QjtBQUN6QixpQkFBaUI7QUFDakIsZUFBZTtBQUNmLGlEQUFpRDtBQUNqRCwyREFBMkQ7QUFDM0Qsd0JBQXdCO0FBQ3hCLGtDQUFrQztBQUNsQyx1RUFBdUU7QUFDdkUsZ0tBQWdLO0FBQ2hLLE9BQU87QUFDUCx1Q0FBdUM7QUFDdkMsS0FBSztBQUVMLGdDQUFnQztBQUNoQyw0QkFBNEI7QUFDNUIsS0FBSztBQUNMLG1CQUFtQjtBQUNuQix1QkFBdUI7QUFFdkIsS0FBSztBQUNMLG1CQUFtQjtBQUVuQixPQUFPO0FBQ1AsY0FBYztBQUNkLG9CQUFvQjtBQUNwQixxQ0FBcUM7QUFDckMsZUFBZTtBQUNmLHdFQUF3RTtBQUN4RSx3QkFBd0I7QUFDeEIsa0NBQWtDO0FBQ2xDLDBGQUEwRjtBQUMxRiw0SkFBNEo7QUFDNUosT0FBTztBQUNQLGVBQWU7QUFDZixJQUFJO0FBQ0osS0FBSztBQUNMLDZCQUE2QjtBQUM3QixzQ0FBc0M7QUFDdEMsSUFBSTtBQUVKLG1CQUFtQjtBQUNuQix1QkFBdUI7QUFFdkIsY0FBYztBQUNkLHNCQUFzQjtBQUV0QixLQUFLO0FBTUwsMkpBQTJKO0FBRTNKLG9CQUFvQjtBQUNwQiwwQkFBMEI7QUFDMUIsZUFBZTtBQUNmLGlDQUFpQztBQUNqQyxvQkFBb0I7QUFDcEIsZUFBZTtBQUNmLDJEQUEyRDtBQUMzRCxvREFBb0Q7QUFDcEQsTUFBTTtBQUNOLEtBQUs7QUFFTCxnREFBZ0Q7QUFDaEQsOENBQThDO0FBQzlDLDREQUE0RDtBQUM1RCw2QkFBNkI7QUFDN0IsZ0NBQWdDO0FBQ2hDLHFDQUFxQztBQUNyQyxRQUFRO0FBQ1IsMEJBQTBCO0FBQzFCLGdEQUFnRDtBQUNoRCxRQUFRO0FBQ1IsTUFBTTtBQUVOLDJCQUEyQjtBQUMzQix5REFBeUQ7QUFDekQsTUFBTTtBQUVOLGdDQUFnQztBQUNoQyx1QkFBdUI7QUFDdkIsYUFBYSJ9