declare module 'smtp-server' {
  export class SMTPServer {
    constructor(opts: object);
    on(msg: string, cb: Function);
    listen(port:number, host?:string, cb?: Function);
    onConnect(session, cb);
  }
}