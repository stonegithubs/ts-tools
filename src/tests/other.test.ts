// import fs, { createReadStream } from 'fs';
import request from 'request';
// import rp from 'request-promise';
import Chaojiying from '../lib/chaojiying/chaojiying';



// rp('https://baikebcs.bdimg.com/adpic/jiangfangzhou.png', {
// }).then(data => {
//   console.log(data);
// })

let cjy = new Chaojiying('179817004', 'Mailofchaojiying*');

cjy.getScore().then(data => {
  console.log(data);
})

let r = request('https://epnex.io/api/userValidateCode', {
  headers: {
    'Host': 'epnex.io',
    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1'
  }
});
// // let r = request('https://baikebcs.bdimg.com/adpic/jiangfangzhou.png');
r.on('error', e => {
  console.log(e);

})
// r.pipe(fs.createWriteStream('./doodle1114.png'))
// r.pipe(fs.createWriteStream('./doodle.png'))
setTimeout(() => {
  cjy.validate(r, '1004', '896776').then(data => {
    console.log(data);
  })
}, 8000)
