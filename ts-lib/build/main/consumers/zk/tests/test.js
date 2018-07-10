"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../../lib/utils");
const zk_1 = __importDefault(require("../zk"));
let count = 0;
let max = 100;
function run() {
    count++;
    if (count > max)
        return;
    let zk = new zk_1.default('D2480D');
    zk.task(count);
    let randTime = utils_1.getRandomInt(10, 3);
    utils_1.log(`${randTime}分钟以后执行下一次操作`);
    setTimeout(() => {
        run();
    }, randTime * 1000 * 60);
}
run();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9jb25zdW1lcnMvemsvdGVzdHMvdGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUNBLDhDQUF1RDtBQUN2RCwrQ0FBdUI7QUFFdkIsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO0FBQ2QsSUFBSSxHQUFHLEdBQUcsR0FBRyxDQUFDO0FBRWQ7SUFDSSxLQUFLLEVBQUUsQ0FBQztJQUNSLElBQUksS0FBSyxHQUFHLEdBQUc7UUFBRSxPQUFPO0lBQ3hCLElBQUksRUFBRSxHQUFHLElBQUksWUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzFCLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDZixJQUFJLFFBQVEsR0FBRyxvQkFBWSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQVcsQ0FBQztJQUM3QyxXQUFHLENBQUMsR0FBRyxRQUFRLGFBQWEsQ0FBQyxDQUFDO0lBQzlCLFVBQVUsQ0FBQyxHQUFHLEVBQUU7UUFDWixHQUFHLEVBQUUsQ0FBQztJQUNWLENBQUMsRUFBRSxRQUFRLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0FBQzdCLENBQUM7QUFFRCxHQUFHLEVBQUUsQ0FBQyJ9