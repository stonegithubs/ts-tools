"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongo_1 = __importDefault(require("../../../lib/mongo/"));
const zk_1 = __importDefault(require("../zk"));
const utils_1 = require("../../../lib/utils");
new mongo_1.default().getCollection('zk', 'regists').then(col => {
    let count = 1;
    col.find({ txtCode: '3E3C23A511B835C' }).limit(utils_1.getRandomInt(20, 5)).forEach(el => {
        let zk = new zk_1.default(el.txtCode);
        zk.task(count++);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3ViUmVnaXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2NvbnN1bWVycy96ay90ZXN0cy9zdWJSZWdpc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxnRUFBd0M7QUFDeEMsK0NBQXVCO0FBQ3ZCLDhDQUFrRDtBQUdsRCxJQUFJLGVBQUssRUFBRSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFO0lBQ3BELElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztJQUNkLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBQyxPQUFPLEVBQUUsaUJBQWlCLEVBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxvQkFBWSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsRUFBRTtRQUM3RSxJQUFJLEVBQUUsR0FBRyxJQUFJLFlBQUUsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDNUIsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO0lBQ25CLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQyxDQUFDLENBQUEifQ==