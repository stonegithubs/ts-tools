"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
const utils_1 = require("../utils");
class WS extends ws_1.default {
    constructor(url, opt) {
        super(url, opt);
        this.msgQueue = [];
        this.onopen = this._onopen; // https://github.com/websockets/ws/issues/1404
        this.onmessage = this._onmessage;
        this.onerror = this._onerror;
        this.onclose = this._onclose;
    }
    _onopen() {
        this.flushMsgQueue();
    }
    _onmessage(msg) {
        //
        msg = msg;
    }
    _onerror(e) {
        console.log(e);
    }
    _onclose(e) {
        console.log(e);
    }
    send(msg, opts, cb) {
        msg = utils_1.getType(msg) === 'Object' ? JSON.stringify(msg) : msg;
        if (this.readyState === this.OPEN) {
            super.send(msg, opts, cb);
        }
        else {
            this.msgQueue.push({ msg, opts, cb });
        }
    }
    flushMsgQueue() {
        this.msgQueue.forEach(el => {
            super.send(el.msg, el.opt, el.cb);
        });
    }
}
exports.default = WS;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL3dlYnNvY2tldC9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDRDQUEyQjtBQUMzQixvQ0FBbUM7QUFFbkMsUUFBd0IsU0FBUSxZQUFTO0lBRXJDLFlBQVksR0FBRyxFQUFFLEdBQUk7UUFDakIsS0FBSyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUZaLGFBQVEsR0FBVyxFQUFFLENBQUM7UUFHMUIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUUsK0NBQStDO1FBQzVFLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQztRQUNqQyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7UUFDN0IsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQ2pDLENBQUM7SUFDRCxPQUFPO1FBQ0gsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO0lBQ3pCLENBQUM7SUFDRCxVQUFVLENBQUMsR0FBSTtRQUNYLEVBQUU7UUFDRixHQUFHLEdBQUcsR0FBRyxDQUFDO0lBQ2QsQ0FBQztJQUNELFFBQVEsQ0FBQyxDQUFDO1FBQ04sT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNuQixDQUFDO0lBQ0QsUUFBUSxDQUFDLENBQUM7UUFDTixPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ25CLENBQUM7SUFDRCxJQUFJLENBQUMsR0FBRyxFQUFFLElBQUssRUFBRSxFQUFHO1FBQ2hCLEdBQUcsR0FBRyxlQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7UUFDNUQsSUFBSSxJQUFJLENBQUMsVUFBVSxLQUFLLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDL0IsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1NBQzdCO2FBQU07WUFDSCxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztTQUN6QztJQUNMLENBQUM7SUFDRCxhQUFhO1FBQ1QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLEVBQUU7WUFDdkIsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3RDLENBQUMsQ0FBQyxDQUFBO0lBQ04sQ0FBQztDQUNKO0FBbkNELHFCQW1DQyJ9