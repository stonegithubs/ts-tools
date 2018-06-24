/// <reference path="../../../../src/lib/websocket/ws.d.ts" />
import WebSocket from 'ws';
export default class WS extends WebSocket {
    private msgQueue;
    constructor(url: any, opt?: any);
    _onopen(): void;
    _onmessage(msg?: any): void;
    _onerror(e: any): void;
    _onclose(e: any): void;
    send(msg: any, opts?: any, cb?: any): void;
    flushMsgQueue(): void;
}
