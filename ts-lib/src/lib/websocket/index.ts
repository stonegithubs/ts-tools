import WebSocket from 'ws';
import { getType } from '../utils';

export default class WS extends WebSocket {
    private msgQueue: any [] = [];
    constructor(url, opt?) {
        super(url, opt);
        this.onopen = this._onopen;  // https://github.com/websockets/ws/issues/1404
        this.onmessage = this._onmessage;
        this.onerror = this._onerror;
        this.onclose = this._onclose;
    }
    _onopen(): void {
        this.flushMsgQueue();
    }
    _onmessage(msg?): void {
        //
        msg = msg;
    }
    _onerror(e): void {
        console.log(e);
    }
    _onclose(e): void {
        console.log(e);
    }
    send(msg, opts?, cb?): void {
        msg = getType(msg) === 'Object' ? JSON.stringify(msg) : msg;
        if (this.readyState === this.OPEN) {
            super.send(msg, opts, cb);
        } else {
            this.msgQueue.push({ msg, opts, cb });
        }
    }
    flushMsgQueue(): void {
        this.msgQueue.forEach(el => {
            super.send(el.msg, el.opt, el.cb);
        })
    }
}
