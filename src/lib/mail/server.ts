import smtp from 'smtp-protocol';
import { Server } from 'net';

export default class MailServer {
  static instance: MailServer;
  msgList: any[] = [];
  server: Server;
  constructor(fn?, opts = {}) {
    let { instance } = MailServer;
    if (instance) {
      return instance;
    } else {
      this.server = smtp.createServer(opts, fn || this.processMail.bind(this));
      MailServer.instance = this;
    }
  }
  processMail(req) {
    this.msgList.forEach(el => {
      req.on(el.message, el.fn.bind(this, req));
    })
  }
  on(message, fn) {
    this.msgList.push({
      message,
      fn
    })
  }
  listen(port?: number) {
    this.server.listen(port);
  }
}