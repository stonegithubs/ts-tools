"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_1 = __importDefault(require("request"));
// import rp from 'request-promise';
// import stream from 'stream';
// import Chaojiying from '../lib/chaojiying';
// rp('https://baikebcs.bdimg.com/adpic/jiangfangzhou.png', {
// }).then(data => {
//   console.log(data);
// })
// let cjy = new Chaojiying('179817004', 'Mailofchaojiying*');
// cjy.getScore().then(data => {
//   console.log(data);
// })
let jar = request_1.default.jar();
let r = request_1.default('https://epnex.io/api/userValidateCode', {
    headers: {
        'Host': 'epnex.io',
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1'
    },
    jar,
    proxy: 'http://chosan.cn:12345'
}, e => {
    console.log(e, jar);
});
r.on('error', e => {
    console.log(e);
});
r.on('response', (r, b, c) => {
    console.log(r, b, c);
});
// r.pipe(fs.createWriteStream('./doodle1114.png'))
// r.pipe(fs.createWriteStream('./doodle.png'))
// cjy.validate(r, '1005', '896776').then(data => {
//   console.log(data);
// }).catch(e => {
//   console.log(e);
// });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3RoZXIudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy90ZXN0cy9vdGhlci50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsc0RBQThCO0FBQzlCLG9DQUFvQztBQUNwQywrQkFBK0I7QUFDL0IsOENBQThDO0FBRTlDLDZEQUE2RDtBQUM3RCxvQkFBb0I7QUFDcEIsdUJBQXVCO0FBQ3ZCLEtBQUs7QUFFTCw4REFBOEQ7QUFFOUQsZ0NBQWdDO0FBQ2hDLHVCQUF1QjtBQUN2QixLQUFLO0FBQ0wsSUFBSSxHQUFHLEdBQUcsaUJBQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUN4QixJQUFJLENBQUMsR0FBRyxpQkFBTyxDQUFDLHVDQUF1QyxFQUFFO0lBQ3ZELE9BQU8sRUFBRTtRQUNQLE1BQU0sRUFBRSxVQUFVO1FBQ2xCLFlBQVksRUFBRSwySUFBMkk7S0FDMUo7SUFDRCxHQUFHO0lBQ0gsS0FBSyxFQUFFLHdCQUF3QjtDQUNoQyxFQUFFLENBQUMsQ0FBQyxFQUFFO0lBQ0wsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDdEIsQ0FBQyxDQUFDLENBQUM7QUFFSCxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsRUFBRTtJQUNoQixPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2pCLENBQUMsQ0FBQyxDQUFBO0FBRUYsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO0lBQzNCLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQztBQUNyQixDQUFDLENBQUMsQ0FBQTtBQUVGLG1EQUFtRDtBQUNuRCwrQ0FBK0M7QUFFL0MsbURBQW1EO0FBQ25ELHVCQUF1QjtBQUV2QixrQkFBa0I7QUFDbEIsb0JBQW9CO0FBRXBCLE1BQU0ifQ==