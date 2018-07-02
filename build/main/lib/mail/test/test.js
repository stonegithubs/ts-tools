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
    password: '199381'
});
let ms = new server_1.default({
    secure: false,
    hideSTARTTLS: true,
    allowInsecureAuth: true,
    authOptional: true,
    onData(stream, session, cb) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9saWIvbWFpbC90ZXN0L3Rlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxtQ0FBK0I7QUFDL0Isc0RBQTRCO0FBQzVCLDJDQUEwQztBQUMxQyx1REFBbUM7QUFFbkMsSUFBSSxLQUFLLEdBQUcsSUFBSSxpQkFBSyxDQUFDO0lBQ3BCLFFBQVEsRUFBRSxRQUFRO0NBQ25CLENBQUMsQ0FBQztBQUNILElBQUksRUFBRSxHQUFHLElBQUksZ0JBQVUsQ0FBQztJQUN0QixNQUFNLEVBQUUsS0FBSztJQUNiLFlBQVksRUFBRSxJQUFJO0lBQ2xCLGlCQUFpQixFQUFFLElBQUk7SUFDdkIsWUFBWSxFQUFFLElBQUk7SUFDbEIsTUFBTSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsRUFBRTtRQUN4QixJQUFJLEdBQUcsR0FBRyxPQUFPLElBQUksRUFBRSxDQUFDO1FBQ3hCLEdBQUcsSUFBSSxHQUFHLENBQUM7UUFDWCx5QkFBWSxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsRUFBRTtZQUNqQyxFQUFFLEVBQUUsQ0FBQztZQUNMLGNBQUssQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ3JCLEtBQUssQ0FBQyxPQUFPLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUN0RCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRixDQUFDLENBQUM7QUFFSCxFQUFFLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsRUFBRTtJQUNuQixPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ25CLENBQUMsQ0FBQyxDQUFDO0FBRUgsRUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyJ9