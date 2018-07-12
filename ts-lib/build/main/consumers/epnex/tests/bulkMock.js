"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongo_1 = __importDefault(require("../../../lib/mongo/"));
const utils_1 = require("../../../lib/utils");
const epnex_1 = __importDefault(require("../epnex"));
let mongo = new mongo_1.default();
function autoMock() {
    mongo.getCollection('epnex', 'regists').then(col => {
        // let query = {signed:{$lte:2}};
        let cur = col.find();
        let count = 0;
        cur.forEach((item) => {
            count++;
            utils_1.log(`当前第\t${count}\t条数据`);
            let ep = new epnex_1.default(item.invitation); // '00TPBBT'
            let randTime = utils_1.getRandomInt(1000 * 60 * 60 * 5); // 12 小时内完成
            utils_1.log(`将在\t${randTime / 1000}\t秒钟之后模拟用户操作！`, 'warn');
            setTimeout(async () => {
                await ep.login(item.user_email, item.user_password);
                ep.mockOperation();
                col.updateOne(item, { $inc: { signed: 1 } });
            }, randTime);
        });
    });
}
autoMock();
setInterval(autoMock, 1000 * 3600 * 24); // 24小时执行一次
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVsa01vY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvY29uc3VtZXJzL2VwbmV4L3Rlc3RzL2J1bGtNb2NrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsZ0VBQXdDO0FBQ3hDLDhDQUF1RDtBQUN2RCxxREFBNkI7QUFFN0IsSUFBSSxLQUFLLEdBQUcsSUFBSSxlQUFLLEVBQUUsQ0FBQztBQUV4QjtJQUNJLEtBQUssQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUMvQyxpQ0FBaUM7UUFDakMsSUFBSSxHQUFHLEdBQUcsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3JCLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztRQUNkLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUNqQixLQUFLLEVBQUUsQ0FBQztZQUNSLFdBQUcsQ0FBQyxRQUFRLEtBQUssT0FBTyxDQUFDLENBQUM7WUFDMUIsSUFBSSxFQUFFLEdBQUcsSUFBSSxlQUFLLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUUsWUFBWTtZQUNsRCxJQUFJLFFBQVEsR0FBRyxvQkFBWSxDQUFDLElBQUksR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBVyxDQUFDLENBQUcsV0FBVztZQUN4RSxXQUFHLENBQUMsT0FBTyxRQUFRLEdBQUcsSUFBSSxlQUFlLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFFbkQsVUFBVSxDQUFDLEtBQUssSUFBSSxFQUFFO2dCQUNsQixNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7Z0JBQ3BELEVBQUUsQ0FBQyxhQUFhLEVBQUUsQ0FBQztnQkFDbkIsR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUMsQ0FBQyxDQUFDO1lBQ2hELENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUNqQixDQUFDLENBQUMsQ0FBQztJQUNQLENBQUMsQ0FBQyxDQUFBO0FBQ04sQ0FBQztBQUVELFFBQVEsRUFBRSxDQUFDO0FBQ1gsV0FBVyxDQUFDLFFBQVEsRUFBRSxJQUFJLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUUsV0FBVyJ9