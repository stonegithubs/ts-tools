"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/// <reference path='./server.d.ts' />
const smtp_server_1 = require("smtp-server");
class MailServer extends smtp_server_1.SMTPServer {
    constructor(opts = {}) {
        super(opts);
        this.msgList = [];
        let { instance } = MailServer;
        if (instance) {
            return instance;
        }
        else {
            this.server = new smtp_server_1.SMTPServer(opts);
            MailServer.instance = this;
        }
    }
}
exports.default = MailServer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYi9tYWlsL3NlcnZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUFzQztBQUN0Qyw2Q0FBeUM7QUFFekMsZ0JBQWdDLFNBQVEsd0JBQVU7SUFJaEQsWUFBWSxJQUFJLEdBQUcsRUFBRTtRQUNuQixLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFIZCxZQUFPLEdBQVUsRUFBRSxDQUFDO1FBSWxCLElBQUksRUFBRSxRQUFRLEVBQUUsR0FBRyxVQUFVLENBQUM7UUFDOUIsSUFBSSxRQUFRLEVBQUU7WUFDWixPQUFPLFFBQVEsQ0FBQztTQUNqQjthQUFNO1lBQ0wsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLHdCQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbkMsVUFBVSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7U0FDNUI7SUFDSCxDQUFDO0NBQ0Y7QUFkRCw2QkFjQyJ9