import request from 'request';
// import rp from 'request-promise';
// import stream from 'stream';
// import Chaojiying from '../lib/chaojiying';

// rp('https://baikebcs.bdimg.com/adpic/jiangfangzhou.png', {
// }).then(data => {
//   console.log(data);
// })

// let cjy = new Chaojiying('179817004', 'Mailofchaojiying*');

// cjy.getScore().then(data => {
//   console.log(data);
// })
let jar = request.jar();
let r = request('https://epnex.io/api/userValidateCode', {
  headers: {
    'Host': 'epnex.io',
    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1'
  },
  jar,
  proxy: 'http://chosan.cn:12345'
}, e => {
  console.log(e, jar);
});

r.on('error', e => {
  console.log(e);
})

r.on('response', (r, b ,c) => {
  console.log(r,b,c);
})

// r.pipe(fs.createWriteStream('./doodle1114.png'))
// r.pipe(fs.createWriteStream('./doodle.png'))

// cjy.validate(r, '1005', '896776').then(data => {
//   console.log(data);

// }).catch(e => {
//   console.log(e);

// });