"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import fs from 'fs';
// import FormData from 'form-data';
const request_1 = __importDefault(require("request"));
const request_2 = __importDefault(require("../request"));
class Chaojiying {
    constructor(user, pass, softid) {
        this.user = user;
        this.pass = pass;
        this.softid = softid;
        this.requester = new request_2.default(Chaojiying.baseURL);
    }
    validate(userfile, codetype, softId) {
        const { user, pass, softid = softId } = this;
        return new Promise((res, rej) => {
            const rq = request_1.default.post(Chaojiying.baseURL + '/Upload/Processing.php', (err, httpResponse, body) => {
                if (!err && httpResponse.statusCode === 200) {
                    res(typeof body === 'string' ? JSON.parse(body) : body);
                }
                else {
                    rej(err || httpResponse.statusMessage);
                }
            });
            const form = rq.form();
            form.append('user', user);
            form.append('pass', pass);
            form.append('softid', softid);
            form.append('codetype', codetype);
            form.append('userfile', userfile);
        });
    }
    getScore() {
        const { user, pass, requester } = this;
        return requester.workFlow('/Upload/GetScore.php', { user, pass }, 'post');
    }
    async reportError(id, softId) {
        const { user, pass, softid = softId, requester } = this;
        return requester.workFlow('/Upload/ReportError.php', { user, pass, softid, id }, 'post');
    }
}
Chaojiying.baseURL = 'http://upload.chaojiying.net';
exports.default = Chaojiying;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL2NoYW9qaXlpbmcvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSx1QkFBdUI7QUFDdkIsb0NBQW9DO0FBQ3BDLHNEQUE4QjtBQUM5Qix5REFBNkI7QUFHN0I7SUFHRSxZQUFzQixJQUFZLEVBQVksSUFBWSxFQUFZLE1BQWU7UUFBL0QsU0FBSSxHQUFKLElBQUksQ0FBUTtRQUFZLFNBQUksR0FBSixJQUFJLENBQVE7UUFBWSxXQUFNLEdBQU4sTUFBTSxDQUFTO1FBRHJGLGNBQVMsR0FBUSxJQUFJLGlCQUFHLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzJDLENBQUM7SUFDekYsUUFBUSxDQUFDLFFBQWEsRUFBRSxRQUFnQixFQUFFLE1BQWU7UUFDdkQsTUFBTSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsTUFBTSxHQUFHLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQztRQUM3QyxPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFO1lBQzlCLE1BQU0sRUFBRSxHQUFHLGlCQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEdBQUcsd0JBQXdCLEVBQUUsQ0FBQyxHQUFHLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBUSxFQUFFO2dCQUN2RyxJQUFJLENBQUMsR0FBRyxJQUFJLFlBQVksQ0FBQyxVQUFVLEtBQUssR0FBRyxFQUFFO29CQUMzQyxHQUFHLENBQUMsT0FBTyxJQUFJLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztpQkFDekQ7cUJBQU07b0JBQ0wsR0FBRyxDQUFDLEdBQUcsSUFBSSxZQUFZLENBQUMsYUFBYSxDQUFDLENBQUM7aUJBQ3hDO1lBQ0gsQ0FBQyxDQUFDLENBQUE7WUFDRixNQUFNLElBQUksR0FBRyxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDdkIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDMUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDMUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDOUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsUUFBUSxDQUFDLENBQUM7WUFDbEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDcEMsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDO0lBQ0QsUUFBUTtRQUNOLE1BQU0sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxHQUFHLElBQUksQ0FBQztRQUN2QyxPQUFPLFNBQVMsQ0FBQyxRQUFRLENBQUMsc0JBQXNCLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDNUUsQ0FBQztJQUNELEtBQUssQ0FBQyxXQUFXLENBQUMsRUFBRSxFQUFFLE1BQU87UUFDM0IsTUFBTSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsTUFBTSxHQUFHLE1BQU0sRUFBRSxTQUFTLEVBQUUsR0FBRyxJQUFJLENBQUM7UUFDeEQsT0FBTyxTQUFTLENBQUMsUUFBUSxDQUFDLHlCQUF5QixFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsRUFBRSxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDM0YsQ0FBQzs7QUE1QmUsa0JBQU8sR0FBVyw4QkFBOEIsQ0FBQztBQURuRSw2QkE4QkMifQ==