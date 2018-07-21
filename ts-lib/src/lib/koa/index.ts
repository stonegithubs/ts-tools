import cors from '@koa/cors';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import KoaRouter from 'koa-router';
import serveStatic from 'koa-serve-static';

export default class MyKoa{
  public readonly app: Koa;
  public readonly router: KoaRouter;
  constructor(routes: ReadonlyArray<any>, staticDir?: string) {
    const app = new Koa();
    const router = new KoaRouter();
    routes.forEach(el => {
      router[el.method](el.path, el.cb);
    })
    console.log(staticDir);
    
    app
      .use(cors())
      .use(bodyParser())
      .use(router.routes())
      .use(serveStatic(staticDir))

    this.app = app;
    this.router = router;
  }
  public listen(port: number, fn?: (err: [null, Error]) => void): Koa {
    let { app } = this;
    try {
      app.listen(port, fn && fn.bind(null, port));
    } catch (error) {
      console.error(error);
      throw error;
    }
    return app;
  }
}