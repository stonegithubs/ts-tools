"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongo_1 = __importDefault(require("../../../lib/mongo/"));
const epnex_1 = __importDefault(require("../epnex"));
const utils_1 = require("../../../lib/utils");
let mongo = new mongo_1.default();
mongo.getCollection('epnex', 'regists').then(col => {
    let cur = col.find();
    cur.forEach(item => {
        let ep = new epnex_1.default(item.invitation); // '00TPBBT'
        let randTime = utils_1.getRandomInt(3600 * 10);
        utils_1.log(`将在\t${randTime}\t秒钟之后模拟用户操作！`);
        setTimeout(async () => {
            await ep.login(item.user_email, item.user_password);
            ep.mockOperation();
        }, randTime * 1000);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9jb25zdW1lcnMvZXBuZXgvdGVzdHMvdGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLGdFQUF3QztBQUN4QyxxREFBNkI7QUFDN0IsOENBQXVEO0FBRXZELElBQUksS0FBSyxHQUFHLElBQUksZUFBSyxFQUFFLENBQUM7QUFFeEIsS0FBSyxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFO0lBQy9DLElBQUksR0FBRyxHQUFHLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNyQixHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFO1FBQ2YsSUFBSSxFQUFFLEdBQUcsSUFBSSxlQUFLLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUUsWUFBWTtRQUNsRCxJQUFJLFFBQVEsR0FBRyxvQkFBWSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUMsQ0FBQztRQUN2QyxXQUFHLENBQUMsT0FBTyxRQUFRLGVBQWUsQ0FBQyxDQUFDO1FBQ3BDLFVBQVUsQ0FBQyxLQUFLLElBQUksRUFBRTtZQUNsQixNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7WUFDcEQsRUFBRSxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQ3ZCLENBQUMsRUFBRSxRQUFRLEdBQUcsSUFBSSxDQUFDLENBQUM7SUFDeEIsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUMsQ0FBQSJ9