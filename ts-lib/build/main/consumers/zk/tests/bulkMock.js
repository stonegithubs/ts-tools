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
        cur.forEach((item) => {
            count++;
            utils_1.log(`当前第\t${count}\t条数据`);
            let zk = new zk_1.default(item.txtCode, item.txtUserName, item.txtPassword); // '00TPBBT'
            let randTime = utils_1.getRandomInt(1000 * 60 * 60); // 5 小时内完成
            utils_1.log(`将在\t${randTime / 1000}\t秒钟之后模拟用户操作！`);
            setTimeout(async () => {
                await zk.login();
                col.updateOne(item, { $inc: { signed: 1 } });
            }, randTime);
        });
    });
}
autoMock();
setInterval(autoMock, 1000 * 3600 * 24); // 24小时执行一次
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVsa01vY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvY29uc3VtZXJzL3prL3Rlc3RzL2J1bGtNb2NrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsZ0VBQXdDO0FBQ3hDLDhDQUF1RDtBQUN2RCwrQ0FBdUI7QUFFdkIsSUFBSSxLQUFLLEdBQUcsSUFBSSxlQUFLLEVBQUUsQ0FBQztBQUV4QjtJQUNJLEtBQUssQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUM1QyxpQ0FBaUM7UUFDakMsSUFBSSxHQUFHLEdBQUcsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3JCLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztRQUNkLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUNqQixLQUFLLEVBQUUsQ0FBQztZQUNSLFdBQUcsQ0FBQyxRQUFRLEtBQUssT0FBTyxDQUFDLENBQUM7WUFDMUIsSUFBSSxFQUFFLEdBQUcsSUFBSSxZQUFFLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFFLFlBQVk7WUFDaEYsSUFBSSxRQUFRLEdBQUcsb0JBQVksQ0FBQyxJQUFJLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBVyxDQUFDLENBQUcsVUFBVTtZQUNuRSxXQUFHLENBQUMsT0FBTyxRQUFRLEdBQUcsSUFBSSxlQUFlLENBQUMsQ0FBQztZQUUzQyxVQUFVLENBQUMsS0FBSyxJQUFJLEVBQUU7Z0JBQ2xCLE1BQU0sRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUNqQixHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxFQUFFLElBQUksRUFBRSxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBQyxDQUFDLENBQUM7WUFDaEQsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ2pCLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFDLENBQUE7QUFDTixDQUFDO0FBRUQsUUFBUSxFQUFFLENBQUM7QUFDWCxXQUFXLENBQUMsUUFBUSxFQUFFLElBQUksR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBRSxXQUFXIn0=