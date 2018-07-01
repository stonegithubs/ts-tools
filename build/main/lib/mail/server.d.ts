/// <reference types="node" />
import { Server } from 'net';
export default class MailServer {
    static instance: MailServer;
    msgList: any[];
    server: Server;
    constructor(fn?: any, opts?: {});
    processMail(req: any): void;
    on(message: any, fn: any): void;
    listen(port?: number): void;
}
