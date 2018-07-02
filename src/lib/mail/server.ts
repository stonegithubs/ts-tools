/// <reference path='./server.d.ts' />
import { SMTPServer } from 'smtp-server';

export default class MailServer extends SMTPServer{
  static instance: MailServer;
  msgList: any[] = [];
  server: SMTPServer;
  constructor(opts = {}) {
    super(opts);
    let { instance } = MailServer;
    if (instance) {
      return instance;
    } else {
      this.server = new SMTPServer(opts);
      MailServer.instance = this;
    }
  }
}