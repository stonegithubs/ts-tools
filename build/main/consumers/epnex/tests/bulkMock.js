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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVsa01vY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvY29uc3VtZXJzL2VwbmV4L3Rlc3RzL2J1bGtNb2NrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsZ0VBQXdDO0FBQ3hDLHFEQUE2QjtBQUM3Qiw4Q0FBdUQ7QUFFdkQsSUFBSSxLQUFLLEdBQUcsSUFBSSxlQUFLLEVBQUUsQ0FBQztBQUV4QixLQUFLLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUU7SUFDL0MsSUFBSSxHQUFHLEdBQUcsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ3JCLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFDZixJQUFJLEVBQUUsR0FBRyxJQUFJLGVBQUssQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBRSxZQUFZO1FBQ2xELElBQUksUUFBUSxHQUFHLG9CQUFZLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBQ3ZDLFdBQUcsQ0FBQyxPQUFPLFFBQVEsZUFBZSxDQUFDLENBQUM7UUFDcEMsVUFBVSxDQUFDLEtBQUssSUFBSSxFQUFFO1lBQ2xCLE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUNwRCxFQUFFLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDdkIsQ0FBQyxFQUFFLFFBQVEsR0FBRyxJQUFJLENBQUMsQ0FBQztJQUN4QixDQUFDLENBQUMsQ0FBQztBQUNQLENBQUMsQ0FBQyxDQUFBIn0=