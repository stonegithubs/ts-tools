"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("assert");
const ioredis_1 = __importDefault(require("ioredis"));
const mailparser_1 = require("mailparser");
const server_1 = __importDefault(require("../server"));
let redis = new ioredis_1.default({
    host: 'localhost',
    password: '199381'
});
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
            redis.publish('mailReceived', JSON.stringify(mail));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbFNlcnZlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9saWIvbWFpbC90ZXN0L21haWxTZXJ2ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxtQ0FBK0I7QUFDL0Isc0RBQTRCO0FBQzVCLDJDQUEwQztBQUMxQyx1REFBbUM7QUFFbkMsSUFBSSxLQUFLLEdBQUcsSUFBSSxpQkFBSyxDQUFDO0lBQ3BCLElBQUksRUFBRSxXQUFXO0lBQ2pCLFFBQVEsRUFBRSxRQUFRO0NBQ25CLENBQUMsQ0FBQztBQUNILElBQUksRUFBRSxHQUFHLElBQUksZ0JBQVUsQ0FBQztJQUN0QixNQUFNLEVBQUUsS0FBSztJQUNiLFlBQVksRUFBRSxJQUFJO0lBQ2xCLGlCQUFpQixFQUFFLElBQUk7SUFDdkIsWUFBWSxFQUFFLElBQUk7SUFDbEIsTUFBTSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsRUFBRTtRQUN4QixPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3JCLElBQUksR0FBRyxHQUFHLE9BQU8sSUFBSSxFQUFFLENBQUM7UUFDeEIsR0FBRyxJQUFJLEdBQUcsQ0FBQztRQUNYLHlCQUFZLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxFQUFFO1lBQ2pDLEVBQUUsRUFBRSxDQUFDO1lBQ0wsY0FBSyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDckIsS0FBSyxDQUFDLE9BQU8sQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ3RELENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGLENBQUMsQ0FBQztBQUVILEVBQUUsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxFQUFFO0lBQ25CLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDbkIsQ0FBQyxDQUFDLENBQUM7QUFFSCxFQUFFLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBRWQsb0NBQW9DO0FBRXBDLG1DQUFtQztBQUNuQywwQkFBMEI7QUFDMUIsSUFBSSJ9