"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_1 = __importDefault(require("../request"));
class Chaojiying {
    constructor(user, pass) {
        this.user = user;
        this.pass = pass;
    }
    validate(userfile, codetype, softid = 896776) {
        const { user, pass } = this;
        return request_1.default.getJson(Chaojiying.host + 'Upload/Processing.php', { user, pass, softid, codetype }, 'post', { formData: { userfile } });
    }
    getScore() {
        const { user, pass } = this;
        return request_1.default.getJson(Chaojiying.host + 'Upload/GetScore.php', { user, pass }, 'post');
    }
}
Chaojiying.host = 'http://upload.chaojiying.net/';
exports.default = Chaojiying;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhb2ppeWluZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9saWIvY2hhb2ppeWluZy9jaGFvaml5aW5nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEseURBQTZCO0FBRTdCO0lBR0UsWUFBc0IsSUFBWSxFQUFZLElBQVk7UUFBcEMsU0FBSSxHQUFKLElBQUksQ0FBUTtRQUFZLFNBQUksR0FBSixJQUFJLENBQVE7SUFBRyxDQUFDO0lBQzlELFFBQVEsQ0FBQyxRQUFhLEVBQUUsUUFBZ0IsRUFBRSxTQUFpQixNQUFNO1FBQy9ELE1BQU0sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDO1FBQzVCLE9BQU8saUJBQUcsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksR0FBRyx1QkFBdUIsRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxFQUFFLE1BQU0sRUFBRSxFQUFFLFFBQVEsRUFBRSxFQUFFLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUN0SSxDQUFDO0lBQ0QsUUFBUTtRQUNOLE1BQU0sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDO1FBQzVCLE9BQU8saUJBQUcsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksR0FBRyxxQkFBcUIsRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUN0RixDQUFDOztBQVZNLGVBQUksR0FBVywrQkFBK0IsQ0FBQztBQUR4RCw2QkFZQyJ9