

declare module "ws" {
    export default class WebSocket {
        readyState: number;
        OPEN: number;
        constructor(url: string, opt?);
        send(msg: any, opts?, cb?);
        onopen(event?: any);
        onclose(event?: any);
        onerror(event?: any);
        onmessage(data?: any);
        ping();
        on(event: string, listener: (data) => void);
    }
}