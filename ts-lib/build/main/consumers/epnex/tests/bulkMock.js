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
        let query = { signed: { $lte: 2 } };
        let cur = col.find(query);
        let count = 0;
        cur.forEach((item) => {
            count++;
            utils_1.log(`当前第\t${count}\t条数据`);
            let ep = new epnex_1.default(item.invitation); // '00TPBBT'
            let randTime = utils_1.getRandomInt(1000 * 60 * 60 * 2); // 12 小时内完成
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVsa01vY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvY29uc3VtZXJzL2VwbmV4L3Rlc3RzL2J1bGtNb2NrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsZ0VBQXdDO0FBQ3hDLDhDQUF1RDtBQUN2RCxxREFBNkI7QUFFN0IsSUFBSSxLQUFLLEdBQUcsSUFBSSxlQUFLLEVBQUUsQ0FBQztBQUV4QjtJQUNJLEtBQUssQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUMvQyxJQUFJLEtBQUssR0FBRyxFQUFDLE1BQU0sRUFBQyxFQUFDLElBQUksRUFBQyxDQUFDLEVBQUMsRUFBQyxDQUFDO1FBQzlCLElBQUksR0FBRyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDMUIsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ2QsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO1lBQ2pCLEtBQUssRUFBRSxDQUFDO1lBQ1IsV0FBRyxDQUFDLFFBQVEsS0FBSyxPQUFPLENBQUMsQ0FBQztZQUMxQixJQUFJLEVBQUUsR0FBRyxJQUFJLGVBQUssQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBRSxZQUFZO1lBQ2xELElBQUksUUFBUSxHQUFHLG9CQUFZLENBQUMsSUFBSSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFXLENBQUMsQ0FBRyxXQUFXO1lBQ3hFLFdBQUcsQ0FBQyxPQUFPLFFBQVEsR0FBRyxJQUFJLGVBQWUsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUVuRCxVQUFVLENBQUMsS0FBSyxJQUFJLEVBQUU7Z0JBQ2xCLE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztnQkFDcEQsRUFBRSxDQUFDLGFBQWEsRUFBRSxDQUFDO2dCQUNuQixHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBQyxDQUFDLENBQUM7WUFDaEQsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ2pCLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFDLENBQUE7QUFDTixDQUFDO0FBRUQsUUFBUSxFQUFFLENBQUM7QUFDWCxXQUFXLENBQUMsUUFBUSxFQUFFLElBQUksR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBRSxXQUFXIn0=