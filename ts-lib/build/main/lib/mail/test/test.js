"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("assert");
const mailparser_1 = require("mailparser");
const server_1 = __importDefault(require("../server"));
// let redis = new Redis({
//   host: 'chosan.cn',
//   password: '199381'
// });
let ms = new server_1.default({
    secure: false,
    hideSTARTTLS: true,
    allowInsecureAuth: true,
    authOptional: true,
    onData(stream, session, cb) {
        console.log('收到数据！');
        let tmp = session || cb;
        tmp += tmp;
        mailparser_1.simpleParser(stream, (err, mail) => {
            cb();
            assert_1.equal(err, null, '');
            // redis.publish('mailReceived', JSON.stringify(mail));
        });
    }
});
ms.on('error', err => {
    console.log(err);
});
ms.listen(25);
// import { gMail } from '../utils';
// for(let i = 0; i < 100; i ++ ) {
//   console.log(gMail());
// }
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9saWIvbWFpbC90ZXN0L3Rlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxtQ0FBK0I7QUFFL0IsMkNBQTBDO0FBQzFDLHVEQUFtQztBQUVuQywwQkFBMEI7QUFDMUIsdUJBQXVCO0FBQ3ZCLHVCQUF1QjtBQUN2QixNQUFNO0FBQ04sSUFBSSxFQUFFLEdBQUcsSUFBSSxnQkFBVSxDQUFDO0lBQ3RCLE1BQU0sRUFBRSxLQUFLO0lBQ2IsWUFBWSxFQUFFLElBQUk7SUFDbEIsaUJBQWlCLEVBQUUsSUFBSTtJQUN2QixZQUFZLEVBQUUsSUFBSTtJQUNsQixNQUFNLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxFQUFFO1FBQ3hCLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDckIsSUFBSSxHQUFHLEdBQUcsT0FBTyxJQUFJLEVBQUUsQ0FBQztRQUN4QixHQUFHLElBQUksR0FBRyxDQUFDO1FBQ1gseUJBQVksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLEVBQUU7WUFDakMsRUFBRSxFQUFFLENBQUM7WUFDTCxjQUFLLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztZQUNyQix1REFBdUQ7UUFDekQsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0YsQ0FBQyxDQUFDO0FBRUgsRUFBRSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLEVBQUU7SUFDbkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNuQixDQUFDLENBQUMsQ0FBQztBQUVILEVBQUUsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7QUFFZCxvQ0FBb0M7QUFFcEMsbUNBQW1DO0FBQ25DLDBCQUEwQjtBQUMxQixJQUFJIn0=