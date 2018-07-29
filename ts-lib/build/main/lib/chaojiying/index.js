"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import fs from 'fs';
// import FormData from 'form-data';
const request_1 = __importDefault(require("request"));
const xundaili_1 = __importDefault(require("../proxy/xundaili"));
const request_2 = __importDefault(require("../request"));
const xdl = new xundaili_1.default({ orderno: 'ZF20187249103GcJiAA', secret: 'f7691def90804df3ba830c1a1308a718' }); // ZF2018744533NVHTc0 ZF20187249103GcJiAA
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL2NoYW9qaXlpbmcvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSx1QkFBdUI7QUFDdkIsb0NBQW9DO0FBQ3BDLHNEQUE4QjtBQUM5QixpRUFBeUM7QUFDekMseURBQTZCO0FBSTdCLE1BQU0sR0FBRyxHQUFHLElBQUksa0JBQVEsQ0FBQyxFQUFFLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLEVBQUUsa0NBQWtDLEVBQUUsQ0FBQyxDQUFDLENBQUMseUNBQXlDO0FBRW5KO0lBR0UsWUFBc0IsSUFBWSxFQUFZLElBQVksRUFBWSxNQUFlO1FBQS9ELFNBQUksR0FBSixJQUFJLENBQVE7UUFBWSxTQUFJLEdBQUosSUFBSSxDQUFRO1FBQVksV0FBTSxHQUFOLE1BQU0sQ0FBUztRQURyRixjQUFTLEdBQVEsSUFBSSxpQkFBRyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUMyQyxDQUFDO0lBQ3pGLFFBQVEsQ0FBQyxRQUFhLEVBQUUsUUFBZ0IsRUFBRSxNQUFlO1FBQ3ZELE1BQU0sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLE1BQU0sR0FBRyxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUM7UUFDN0MsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRTtZQUM5QixNQUFNLEVBQUUsR0FBRyxpQkFBTyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxHQUFHLHdCQUF3QixFQUFFLENBQUMsR0FBRyxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQVEsRUFBRTtnQkFDdkcsSUFBSSxDQUFDLEdBQUcsSUFBSSxZQUFZLENBQUMsVUFBVSxLQUFLLEdBQUcsRUFBRTtvQkFDM0MsR0FBRyxDQUFDLE9BQU8sSUFBSSxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7aUJBQ3pEO3FCQUFNO29CQUNMLEdBQUcsQ0FBQyxHQUFHLElBQUksWUFBWSxDQUFDLGFBQWEsQ0FBQyxDQUFDO2lCQUN4QztZQUNILENBQUMsQ0FBQyxDQUFBO1lBQ0YsTUFBTSxJQUFJLEdBQUcsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQzFCLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQzFCLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQzlCLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQ2xDLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3BDLENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQztJQUNELFFBQVE7UUFDTixNQUFNLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsR0FBRyxJQUFJLENBQUM7UUFDdkMsT0FBTyxTQUFTLENBQUMsUUFBUSxDQUFDLHNCQUFzQixFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQzVFLENBQUM7SUFDRCxLQUFLLENBQUMsV0FBVyxDQUFDLEVBQUUsRUFBRSxNQUFPO1FBQzNCLE1BQU0sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLE1BQU0sR0FBRyxNQUFNLEVBQUUsU0FBUyxFQUFFLEdBQUcsSUFBSSxDQUFDO1FBQ3hELE9BQU8sU0FBUyxDQUFDLFFBQVEsQ0FBQyx5QkFBeUIsRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQzNGLENBQUM7O0FBNUJlLGtCQUFPLEdBQVcsOEJBQThCLENBQUM7QUFEbkUsNkJBOEJDIn0=