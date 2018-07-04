import Koa from '../../../lib/koa';
import Epnex from '../epnex';

let ep = new Epnex('00TPBBT');

ep.task();

new Koa([
  {
    method: 'post', path: '/', cb: (ctx) => {
      console.log(ctx);
    }
  }
]).listen(8889);


