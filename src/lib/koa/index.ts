import cors from '@koa/cors';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import KoaRouter from 'koa-router';

export default class MyKoa{
  public readonly app: Koa;
  public readonly router: KoaRouter;
  constructor(routes: ReadonlyArray<any> ) {
    const app = new Koa();
    const router = new KoaRouter();
    routes.forEach(el => {
      router[el.method](el.path, el.cb);
    })

    app
      .use(cors())
      .use(bodyParser())
      .use(router.routes());

    this.app = app;
    this.router = router;
  }
  public listen(port: number, fn: (err: [null, Error]) => void): void {
    try {
      this.app.listen(port, fn.bind(null, port));
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}