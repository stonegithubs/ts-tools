"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const request_1 = __importDefault(require("request"));
const request_promise_1 = __importDefault(require("request-promise"));
const chaojiying_1 = __importDefault(require("../lib/chaojiying/chaojiying"));
request_1.default('https://baikebcs.bdimg.com/adpic/jiangfangzhou.png').pipe(fs_1.default.createWriteStream('./doodle.png'));
request_promise_1.default('https://baikebcs.bdimg.com/adpic/jiangfangzhou.png').then(data => {
    console.log(data);
});
let cjy = new chaojiying_1.default('179817004', 'Mailofchaojiying*');
cjy.getScore().then(data => {
    console.log(data);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3RoZXIudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy90ZXN0cy9vdGhlci50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsNENBQW9CO0FBQ3BCLHNEQUE4QjtBQUM5QixzRUFBaUM7QUFDakMsOEVBQXNEO0FBRXRELGlCQUFPLENBQUMsb0RBQW9ELENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBRSxDQUFDLGlCQUFpQixDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUE7QUFFeEcseUJBQUUsQ0FBQyxvREFBb0QsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtJQUNuRSxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3BCLENBQUMsQ0FBQyxDQUFBO0FBRUYsSUFBSSxHQUFHLEdBQUcsSUFBSSxvQkFBVSxDQUFDLFdBQVcsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO0FBRTNELEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7SUFDekIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNwQixDQUFDLENBQUMsQ0FBQSJ9