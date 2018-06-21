// export * from './lib/async';
// export * from './lib/hash';
// export * from './lib/number';

import Req from './lib/request';
import Koa from './lib/koa';

async function go() {
  try {
    let req = new Req();
    await req.workFlow('http://chosan.cn');
    await req.workFlow('http://localhost:8080/test/2')
    console.log(req.data)
  } catch (error) {
    console.log(error)
  }
}

let server = new Koa([
  {
    method: 'get', path: '/test/:id', cb: (ctx) => {
      ctx.body = ctx.params.id;
    }
  },
  {
    method: 'post', path: '/test', cb: (ctx) => {
      console.log(ctx.request.body)
    }
  }
])

server.listen(8080, port => {
  console.log(`服务器启动成功, 端口:\t${port}`);
})

go()