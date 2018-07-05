import fs from 'fs';
import Koa from '../../../lib/koa';
import Epnex from '../epnex';

new Koa([
  {
    method: 'get',
    path: '/',
    cb: ctx => {
      //
      // ctx.body = fs.readFileSync('./index.html');
      console.log('开始执行');
      let ep = new Epnex('00TPBBT');
      ep.task();
    }
  },
  {
    method: 'post',
    path: '/',
    cb: ctx => {
      console.log(ctx);

      // let ep = new Epnex('00TPBBT');

      // ep.task();
    }
  }
]).listen(8889);
