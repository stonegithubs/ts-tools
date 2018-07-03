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
    }
    validate(userfile, codetype, softId) {
        const { user, pass, softid = softId } = this;
        return new Promise((res, rej) => {
            const rq = request_1.default.post(Chaojiying.host + '/Upload/Processing.php', (err, httpResponse, body) => {
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
        const { user, pass } = this;
        return request_2.default.getJson(Chaojiying.host + '/Upload/GetScore.php', { user, pass }, 'post');
    }
}
Chaojiying.host = 'http://upload.chaojiying.net';
exports.default = Chaojiying;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL2NoYW9qaXlpbmcvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSx1QkFBdUI7QUFDdkIsb0NBQW9DO0FBQ3BDLHNEQUE4QjtBQUM5Qix5REFBNkI7QUFFN0I7SUFHRSxZQUFzQixJQUFZLEVBQVksSUFBWSxFQUFZLE1BQWU7UUFBL0QsU0FBSSxHQUFKLElBQUksQ0FBUTtRQUFZLFNBQUksR0FBSixJQUFJLENBQVE7UUFBWSxXQUFNLEdBQU4sTUFBTSxDQUFTO0lBQUcsQ0FBQztJQUN6RixRQUFRLENBQUMsUUFBYSxFQUFFLFFBQWdCLEVBQUUsTUFBZTtRQUN2RCxNQUFNLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxNQUFNLEdBQUcsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDO1FBQzdDLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUU7WUFDOUIsTUFBTSxFQUFFLEdBQUcsaUJBQU8sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksR0FBRyx3QkFBd0IsRUFBRSxDQUFDLEdBQUcsRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFRLEVBQUU7Z0JBQ3BHLElBQUksQ0FBQyxHQUFHLElBQUksWUFBWSxDQUFDLFVBQVUsS0FBSyxHQUFHLEVBQUU7b0JBQzNDLEdBQUcsQ0FBQyxPQUFPLElBQUksS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO2lCQUN6RDtxQkFBTTtvQkFDTCxHQUFHLENBQUMsR0FBRyxJQUFJLFlBQVksQ0FBQyxhQUFhLENBQUMsQ0FBQztpQkFDeEM7WUFDSCxDQUFDLENBQUMsQ0FBQTtZQUNGLE1BQU0sSUFBSSxHQUFHLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUN2QixJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztZQUMxQixJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztZQUMxQixJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztZQUM5QixJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxRQUFRLENBQUMsQ0FBQztZQUNsQyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUNwQyxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUM7SUFDRCxRQUFRO1FBQ04sTUFBTSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUM7UUFDNUIsT0FBTyxpQkFBRyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsSUFBSSxHQUFHLHNCQUFzQixFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ3ZGLENBQUM7O0FBeEJNLGVBQUksR0FBVyw4QkFBOEIsQ0FBQztBQUR2RCw2QkEwQkMifQ==