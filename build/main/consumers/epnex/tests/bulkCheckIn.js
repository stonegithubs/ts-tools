"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongo_1 = __importDefault(require("../../../lib/mongo/"));
const epnex_1 = __importDefault(require("../epnex"));
let mongo = new mongo_1.default();
mongo.getCollection('epnex', 'regists').then(col => {
    let cur = col.find();
    cur.forEach(async (item) => {
        let ep = new epnex_1.default(item.invitation); // '00TPBBT'
        await ep.login();
        ep.mockOperation();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVsa0NoZWNrSW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvY29uc3VtZXJzL2VwbmV4L3Rlc3RzL2J1bGtDaGVja0luLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsZ0VBQXdDO0FBQ3hDLHFEQUE2QjtBQUU3QixJQUFJLEtBQUssR0FBRyxJQUFJLGVBQUssRUFBRSxDQUFDO0FBRXhCLEtBQUssQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLFNBQVMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRTtJQUMvQyxJQUFJLEdBQUcsR0FBRyxHQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDckIsR0FBRyxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUMsSUFBSSxFQUFDLEVBQUU7UUFDckIsSUFBSSxFQUFFLEdBQUcsSUFBSSxlQUFLLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUUsWUFBWTtRQUNsRCxNQUFNLEVBQUUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNqQixFQUFFLENBQUMsYUFBYSxFQUFFLENBQUM7SUFDdkIsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUMsQ0FBQSJ9