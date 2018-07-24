"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const luckybi_1 = __importDefault(require("../luckybi"));
const utils_1 = require("../../../lib/utils");
async function task() {
    let lucky = new luckybi_1.default('');
    let r = await lucky.task();
    utils_1.log(r);
}
task();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9jb25zdW1lcnMvbHVja3liaS90ZXN0cy90ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEseURBQWlDO0FBQ2pDLDhDQUF5QztBQUV6QyxLQUFLO0lBQ0gsSUFBSSxLQUFLLEdBQUcsSUFBSSxpQkFBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzVCLElBQUksQ0FBQyxHQUFHLE1BQU0sS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQzNCLFdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNULENBQUM7QUFFRCxJQUFJLEVBQUUsQ0FBQyJ9