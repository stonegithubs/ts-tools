"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_1 = __importDefault(require("../request"));
class Chaojiying {
    constructor(user, pass, softid) {
        this.user = user;
        this.pass = pass;
        this.softid = softid;
    }
    validate(userfile, codetype, softId) {
        const { user, pass, softid = softId } = this;
        return request_1.default.getJson(Chaojiying.host + 'Upload/Processing.php', { user, pass, softid, codetype, userfile }, 'post');
    }
    getScore() {
        const { user, pass } = this;
        return request_1.default.getJson(Chaojiying.host + 'Upload/GetScore.php', { user, pass }, 'post');
    }
}
Chaojiying.host = 'http://upload.chaojiying.net/';
exports.default = Chaojiying;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhb2ppeWluZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9saWIvY2hhb2ppeWluZy9jaGFvaml5aW5nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEseURBQTZCO0FBRTdCO0lBR0UsWUFBc0IsSUFBWSxFQUFZLElBQVksRUFBWSxNQUFlO1FBQS9ELFNBQUksR0FBSixJQUFJLENBQVE7UUFBWSxTQUFJLEdBQUosSUFBSSxDQUFRO1FBQVksV0FBTSxHQUFOLE1BQU0sQ0FBUztJQUFHLENBQUM7SUFDekYsUUFBUSxDQUFDLFFBQWEsRUFBRSxRQUFnQixFQUFFLE1BQWU7UUFDdkQsTUFBTSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsTUFBTSxHQUFHLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQztRQUM3QyxPQUFPLGlCQUFHLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEdBQUcsdUJBQXVCLEVBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDbkgsQ0FBQztJQUNELFFBQVE7UUFDTixNQUFNLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQztRQUM1QixPQUFPLGlCQUFHLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEdBQUcscUJBQXFCLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDdEYsQ0FBQzs7QUFWTSxlQUFJLEdBQVcsK0JBQStCLENBQUM7QUFEeEQsNkJBWUMifQ==