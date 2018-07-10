/// <reference path="../../../../src/lib/mail/server.d.ts" />
import { SMTPServer } from 'smtp-server';
export default class MailServer extends SMTPServer {
    static instance: MailServer;
    msgList: any[];
    server: SMTPServer;
    constructor(opts?: {});
}
