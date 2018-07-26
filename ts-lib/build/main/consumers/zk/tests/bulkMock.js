"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongo_1 = __importDefault(require("../../../lib/mongo/"));
const utils_1 = require("../../../lib/utils");
const zk_1 = __importDefault(require("../zk"));
let mongo = new mongo_1.default();
function autoMock() {
    mongo.getCollection('zk', 'regists').then(col => {
        // let query = {signed:{$lte:1}};
        let cur = col.find();
        let count = 0;
        let success = 0;
        cur.forEach((item) => {
            utils_1.log(`当前第\t${count}\t条数据`);
            let zk = new zk_1.default(item.txtCode, item.txtUserName, item.txtPassword); // '00TPBBT'
            let randTime = utils_1.getRandomInt(1000);
            utils_1.log(`将在\t${randTime / 1000}\t秒钟之后模拟用户操作！`);
            // count <= 10 &&
            setTimeout(async () => {
                count++;
                await zk.login(count);
                utils_1.log(`${'-'.repeat(20)}\n成功${++success}条\n${'-'.repeat(20)}`, 'warn');
                col.updateOne(item, { $inc: { signed: 1 } });
            }, randTime);
        });
    });
}
autoMock();
setInterval(autoMock, 1000 * 3600 * 24); // 24小时执行一次
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVsa01vY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvY29uc3VtZXJzL3prL3Rlc3RzL2J1bGtNb2NrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsZ0VBQXdDO0FBQ3hDLDhDQUF1RDtBQUN2RCwrQ0FBdUI7QUFFdkIsSUFBSSxLQUFLLEdBQUcsSUFBSSxlQUFLLEVBQUUsQ0FBQztBQUV4QjtJQUNJLEtBQUssQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUM1QyxpQ0FBaUM7UUFDakMsSUFBSSxHQUFHLEdBQUcsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3JCLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztRQUNkLElBQUksT0FBTyxHQUFHLENBQUMsQ0FBQztRQUNoQixHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7WUFDakIsV0FBRyxDQUFDLFFBQVEsS0FBSyxPQUFPLENBQUMsQ0FBQztZQUMxQixJQUFJLEVBQUUsR0FBRyxJQUFJLFlBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUUsWUFBWTtZQUNoRixJQUFJLFFBQVEsR0FBRyxvQkFBWSxDQUFDLElBQUksQ0FBVyxDQUFDO1lBQzVDLFdBQUcsQ0FBQyxPQUFPLFFBQVEsR0FBRyxJQUFJLGVBQWUsQ0FBQyxDQUFDO1lBQzNDLGlCQUFpQjtZQUNqQixVQUFVLENBQUMsS0FBSyxJQUFJLEVBQUU7Z0JBQ2xCLEtBQUssRUFBRSxDQUFDO2dCQUNSLE1BQU0sRUFBRSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDdEIsV0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLE9BQU8sTUFBTSxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7Z0JBQ3JFLEdBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFDLENBQUMsQ0FBQztZQUNoRCxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDakIsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDLENBQUMsQ0FBQTtBQUNOLENBQUM7QUFFRCxRQUFRLEVBQUUsQ0FBQztBQUNYLFdBQVcsQ0FBQyxRQUFRLEVBQUUsSUFBSSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFFLFdBQVcifQ==