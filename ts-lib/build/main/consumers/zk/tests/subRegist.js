"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongo_1 = __importDefault(require("../../../lib/mongo/"));
const zk_1 = __importDefault(require("../zk"));
const utils_1 = require("../../../lib/utils");
new mongo_1.default().getCollection('zk', 'regists').then(async (col) => {
    let count = 1;
    col.find({ txtCode: 'D2480D' }).limit(utils_1.getRandomInt(20, 5)).skip(utils_1.getRandomInt(200)).forEach(async (el) => {
        let zk = new zk_1.default(el.txtCode, el.txtUserName, el.txtPassword);
        let inviteCode = await zk.getInviteCode();
        if (inviteCode) {
            let regZk = new zk_1.default(inviteCode);
            regZk.task(count++);
        }
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3ViUmVnaXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2NvbnN1bWVycy96ay90ZXN0cy9zdWJSZWdpc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxnRUFBd0M7QUFDeEMsK0NBQXVCO0FBQ3ZCLDhDQUFrRDtBQUdsRCxJQUFJLGVBQUssRUFBRSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBQyxHQUFHLEVBQUMsRUFBRTtJQUMxRCxJQUFJLEtBQUssR0FBRyxDQUFDLENBQUM7SUFDZCxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUMsT0FBTyxFQUFFLFFBQVEsRUFBQyxDQUFDLENBQUMsS0FBSyxDQUFDLG9CQUFZLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLG9CQUFZLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFDLEVBQUUsRUFBQyxFQUFFO1FBQ2xHLElBQUksRUFBRSxHQUFHLElBQUksWUFBRSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLFdBQVcsRUFBRSxFQUFFLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDNUQsSUFBSSxVQUFVLEdBQUcsTUFBTSxFQUFFLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDMUMsSUFBSSxVQUFVLEVBQUU7WUFDYixJQUFJLEtBQUssR0FBRyxJQUFJLFlBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUMvQixLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7U0FDdEI7SUFDSCxDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUMsQ0FBQyxDQUFBIn0=