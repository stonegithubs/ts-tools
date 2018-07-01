"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const smtp_protocol_1 = __importDefault(require("smtp-protocol"));
class MailServer {
    constructor(fn, opts = {}) {
        this.msgList = [];
        let { instance } = MailServer;
        if (instance) {
            return instance;
        }
        else {
            this.server = smtp_protocol_1.default.createServer(opts, fn || this.processMail.bind(this));
            MailServer.instance = this;
        }
    }
    processMail(req) {
        this.msgList.forEach(el => {
            req.on(el.message, el.fn.bind(this, req));
        });
    }
    on(message, fn) {
        this.msgList.push({
            message,
            fn
        });
    }
    listen(port) {
        this.server.listen(port);
    }
}
exports.default = MailServer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYi9tYWlsL3NlcnZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLGtFQUFpQztBQUdqQztJQUlFLFlBQVksRUFBRyxFQUFFLElBQUksR0FBRyxFQUFFO1FBRjFCLFlBQU8sR0FBVSxFQUFFLENBQUM7UUFHbEIsSUFBSSxFQUFFLFFBQVEsRUFBRSxHQUFHLFVBQVUsQ0FBQztRQUM5QixJQUFJLFFBQVEsRUFBRTtZQUNaLE9BQU8sUUFBUSxDQUFDO1NBQ2pCO2FBQU07WUFDTCxJQUFJLENBQUMsTUFBTSxHQUFHLHVCQUFJLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxFQUFFLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUN6RSxVQUFVLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztTQUM1QjtJQUNILENBQUM7SUFDRCxXQUFXLENBQUMsR0FBRztRQUNiLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxFQUFFO1lBQ3hCLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUM1QyxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUM7SUFDRCxFQUFFLENBQUMsT0FBTyxFQUFFLEVBQUU7UUFDWixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztZQUNoQixPQUFPO1lBQ1AsRUFBRTtTQUNILENBQUMsQ0FBQTtJQUNKLENBQUM7SUFDRCxNQUFNLENBQUMsSUFBYTtRQUNsQixJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMzQixDQUFDO0NBQ0Y7QUEzQkQsNkJBMkJDIn0=