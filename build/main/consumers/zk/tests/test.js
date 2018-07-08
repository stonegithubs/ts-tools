"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zk_1 = __importDefault(require("../zk"));
let count = 0;
let max = 10;
function run() {
    count++;
    if (count > max)
        return;
    let zk = new zk_1.default('0TP4R4');
    zk.task(count);
    setTimeout(() => {
        run();
    }, 4000);
}
run();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9jb25zdW1lcnMvemsvdGVzdHMvdGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLCtDQUF1QjtBQUV2QixJQUFJLEtBQUssR0FBRyxDQUFDLENBQUM7QUFDZCxJQUFJLEdBQUcsR0FBRyxFQUFFLENBQUM7QUFFYjtJQUNJLEtBQUssRUFBRSxDQUFDO0lBQ1IsSUFBSSxLQUFLLEdBQUcsR0FBRztRQUFFLE9BQU87SUFDeEIsSUFBSSxFQUFFLEdBQUcsSUFBSSxZQUFFLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDMUIsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNmLFVBQVUsQ0FBQyxHQUFHLEVBQUU7UUFDWixHQUFHLEVBQUUsQ0FBQztJQUNWLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNiLENBQUM7QUFFRCxHQUFHLEVBQUUsQ0FBQyJ9