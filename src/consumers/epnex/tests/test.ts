// import Epnex from '../epnex';
import http from 'http';
import rp from 'request-promise';
import Koa from '../../../lib/koa';


// let ep = new Epnex();

// ep.task();

new Koa([
  {
    method: 'post', path: '/', cb: (ctx) => {
      console.log(ctx);

    }
  }
]).listen(8889);

// let r = rp.post('https://epnex.io/api/emailValidCode', {
//   form: `{"user_email":"12314@chosan.cn","PvilidCode":"s7b4r"}`,
//   headers: {
//     Host: 'epnex.io',
//     Origin: 'https://epnex.io',
//     Referer: 'https://epnex.io/phoneSelf_sign.html?i=00VHmxY&lan=0',
//     'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1'
//   },
//   proxy: 'http://chosan.cn:12345'
// })

// r.on('data', (err, data) => {
//   console.log(err, data);
// })

http.request({

})