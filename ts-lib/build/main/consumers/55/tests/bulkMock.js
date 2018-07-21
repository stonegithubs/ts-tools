"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _55_1 = __importDefault(require("../55"));
const mongo_1 = __importDefault(require("../../../lib/mongo/"));
const utils_1 = require("../../../lib/utils");
let mongo = new mongo_1.default();
async function bulkMock() {
    let col = await mongo.getCollection('55', 'regists');
    col.find().forEach(item => {
        let randTime = utils_1.getRandomInt(10) * 1000 * 60 * 60 * 6; // 6 小时之内执行完成
        utils_1.log(`将在${randTime / 1000 / 60}分钟之后执行!`, 'error');
        setTimeout(async () => {
            let c55 = new _55_1.default(item.code);
            await c55.login(item.phone, item.password);
            col.updateOne({ phone: item.phone }, { $inc: { mockTime: 1 } }, { upsert: true });
        }, randTime);
    });
}
bulkMock();
setInterval(bulkMock, 1000 * 60 * 60 * 22); // 22小时执行一次
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVsa01vY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvY29uc3VtZXJzLzU1L3Rlc3RzL2J1bGtNb2NrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsZ0RBQTJCO0FBQzNCLGdFQUF3QztBQUN4Qyw4Q0FBdUQ7QUFFdkQsSUFBSSxLQUFLLEdBQUcsSUFBSSxlQUFLLEVBQUUsQ0FBQztBQUd4QixLQUFLO0lBQ0gsSUFBSSxHQUFHLEdBQUcsTUFBTSxLQUFLLENBQUMsYUFBYSxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztJQUNyRCxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFO1FBQ3hCLElBQUksUUFBUSxHQUFHLG9CQUFZLENBQUMsRUFBRSxDQUFXLEdBQUcsSUFBSSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUcsYUFBYTtRQUMvRSxXQUFHLENBQUMsS0FBSyxRQUFRLEdBQUMsSUFBSSxHQUFDLEVBQUUsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQzdDLFVBQVUsQ0FBQyxLQUFLLElBQUksRUFBRTtZQUNwQixJQUFJLEdBQUcsR0FBRyxJQUFJLGFBQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDaEMsTUFBTSxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzNDLEdBQUcsQ0FBQyxTQUFTLENBQUMsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUMsSUFBSSxFQUFFLEVBQUUsUUFBUSxFQUFFLENBQUMsRUFBRSxFQUFDLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQTtRQUNqRixDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDZixDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUM7QUFFRCxRQUFRLEVBQUUsQ0FBQztBQUVYLFdBQVcsQ0FBQyxRQUFRLEVBQUUsSUFBSSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxXQUFXIn0=