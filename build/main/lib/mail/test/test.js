"use strict";
// import { equal } from 'assert';
// import Redis from 'ioredis';
// import { simpleParser } from 'mailparser';
// import MailServer from '../server';
Object.defineProperty(exports, "__esModule", { value: true });
// let redis = new Redis({
//   host: 'chosan.cn',
//   password: '199381'
// });
// let ms = new MailServer({
//   secure: false,
//   hideSTARTTLS: true,
//   allowInsecureAuth: true,
//   authOptional: true,
//   onData(stream, session, cb): void {
//     let tmp = session || cb;
//     tmp += tmp;
//     simpleParser(stream, (err, mail) => {
//       cb();
//       equal(err, null, '');
//       redis.publish('mailReceived', JSON.stringify(mail));
//     });
//   }
// });
// ms.on('error', err => {
//   console.log(err);
// });
// ms.listen(25);
const utils_1 = require("../utils");
for (let i = 0; i < 100; i++) {
    console.log(utils_1.gMail());
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9saWIvbWFpbC90ZXN0L3Rlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLGtDQUFrQztBQUNsQywrQkFBK0I7QUFDL0IsNkNBQTZDO0FBQzdDLHNDQUFzQzs7QUFFdEMsMEJBQTBCO0FBQzFCLHVCQUF1QjtBQUN2Qix1QkFBdUI7QUFDdkIsTUFBTTtBQUNOLDRCQUE0QjtBQUM1QixtQkFBbUI7QUFDbkIsd0JBQXdCO0FBQ3hCLDZCQUE2QjtBQUM3Qix3QkFBd0I7QUFDeEIsd0NBQXdDO0FBQ3hDLCtCQUErQjtBQUMvQixrQkFBa0I7QUFDbEIsNENBQTRDO0FBQzVDLGNBQWM7QUFDZCw4QkFBOEI7QUFDOUIsNkRBQTZEO0FBQzdELFVBQVU7QUFDVixNQUFNO0FBQ04sTUFBTTtBQUVOLDBCQUEwQjtBQUMxQixzQkFBc0I7QUFDdEIsTUFBTTtBQUVOLGlCQUFpQjtBQUVqQixvQ0FBaUM7QUFFakMsS0FBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLEVBQUcsRUFBRztJQUM3QixPQUFPLENBQUMsR0FBRyxDQUFDLGFBQUssRUFBRSxDQUFDLENBQUM7Q0FDdEIifQ==