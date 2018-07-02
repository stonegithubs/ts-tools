"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import fs, { createReadStream } from 'fs';
const request_1 = __importDefault(require("request"));
// import rp from 'request-promise';
const chaojiying_1 = __importDefault(require("../lib/chaojiying/chaojiying"));
// rp('https://baikebcs.bdimg.com/adpic/jiangfangzhou.png', {
// }).then(data => {
//   console.log(data);
// })
let cjy = new chaojiying_1.default('179817004', 'Mailofchaojiying*');
cjy.getScore().then(data => {
    console.log(data);
});
let r = request_1.default('https://epnex.io/api/userValidateCode', {
    headers: {
        'Host': 'epnex.io',
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1'
    }
});
// // let r = request('https://baikebcs.bdimg.com/adpic/jiangfangzhou.png');
r.on('error', e => {
    console.log(e);
});
// r.pipe(fs.createWriteStream('./doodle1114.png'))
// r.pipe(fs.createWriteStream('./doodle.png'))
setTimeout(() => {
    cjy.validate(r, '1004', '896776').then(data => {
        console.log(data);
    });
}, 8000);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3RoZXIudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy90ZXN0cy9vdGhlci50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsNkNBQTZDO0FBQzdDLHNEQUE4QjtBQUM5QixvQ0FBb0M7QUFDcEMsOEVBQXNEO0FBSXRELDZEQUE2RDtBQUM3RCxvQkFBb0I7QUFDcEIsdUJBQXVCO0FBQ3ZCLEtBQUs7QUFFTCxJQUFJLEdBQUcsR0FBRyxJQUFJLG9CQUFVLENBQUMsV0FBVyxFQUFFLG1CQUFtQixDQUFDLENBQUM7QUFFM0QsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtJQUN6QixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3BCLENBQUMsQ0FBQyxDQUFBO0FBRUYsSUFBSSxDQUFDLEdBQUcsaUJBQU8sQ0FBQyx1Q0FBdUMsRUFBRTtJQUN2RCxPQUFPLEVBQUU7UUFDUCxNQUFNLEVBQUUsVUFBVTtRQUNsQixZQUFZLEVBQUUsMklBQTJJO0tBQzFKO0NBQ0YsQ0FBQyxDQUFDO0FBQ0gsNEVBQTRFO0FBQzVFLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxFQUFFO0lBQ2hCLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFFakIsQ0FBQyxDQUFDLENBQUE7QUFDRixtREFBbUQ7QUFDbkQsK0NBQStDO0FBQy9DLFVBQVUsQ0FBQyxHQUFHLEVBQUU7SUFDZCxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO1FBQzVDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDcEIsQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUEifQ==