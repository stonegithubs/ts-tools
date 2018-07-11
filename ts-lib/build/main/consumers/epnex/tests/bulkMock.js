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
        // let query = {signed:{$lte:1}};
        let cur = col.find();
        let count = 0;
        cur.forEach((item) => {
            count++;
            utils_1.log(`当前第\t${count}\t条数据`);
            let ep = new epnex_1.default(item.invitation); // '00TPBBT'
            let randTime = utils_1.getRandomInt(1000 * 60 * 20); // 12 小时内完成
            utils_1.log(`将在\t${randTime / 1000}\t秒钟之后模拟用户操作！`);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVsa01vY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvY29uc3VtZXJzL2VwbmV4L3Rlc3RzL2J1bGtNb2NrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsZ0VBQXdDO0FBQ3hDLDhDQUF1RDtBQUN2RCxxREFBNkI7QUFFN0IsSUFBSSxLQUFLLEdBQUcsSUFBSSxlQUFLLEVBQUUsQ0FBQztBQUV4QjtJQUNJLEtBQUssQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUMvQyxpQ0FBaUM7UUFDakMsSUFBSSxHQUFHLEdBQUcsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3JCLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztRQUNkLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUNqQixLQUFLLEVBQUUsQ0FBQztZQUNSLFdBQUcsQ0FBQyxRQUFRLEtBQUssT0FBTyxDQUFDLENBQUM7WUFDMUIsSUFBSSxFQUFFLEdBQUcsSUFBSSxlQUFLLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUUsWUFBWTtZQUNsRCxJQUFJLFFBQVEsR0FBRyxvQkFBWSxDQUFDLElBQUksR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFXLENBQUMsQ0FBRyxXQUFXO1lBQ3BFLFdBQUcsQ0FBQyxPQUFPLFFBQVEsR0FBQyxJQUFJLGVBQWUsQ0FBQyxDQUFDO1lBRXpDLFVBQVUsQ0FBQyxLQUFLLElBQUksRUFBRTtnQkFDbEIsTUFBTSxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO2dCQUNwRCxFQUFFLENBQUMsYUFBYSxFQUFFLENBQUM7Z0JBQ25CLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFDLENBQUMsQ0FBQztZQUNoRCxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDakIsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDLENBQUMsQ0FBQTtBQUNOLENBQUM7QUFFRCxRQUFRLEVBQUUsQ0FBQztBQUNYLFdBQVcsQ0FBQyxRQUFRLEVBQUUsSUFBSSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFFLFdBQVcifQ==