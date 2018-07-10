import Koa from 'koa';
import KoaRouter from 'koa-router';
export default class MyKoa {
    readonly app: Koa;
    readonly router: KoaRouter;
    constructor(routes: ReadonlyArray<any>);
    listen(port: number, fn?: (err: [null, Error]) => void): void;
}