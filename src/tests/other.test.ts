import fs from 'fs';
import request from 'request';
import rp from 'request-promise';
import Chaojiying from '../lib/chaojiying/chaojiying';

request('https://baikebcs.bdimg.com/adpic/jiangfangzhou.png').pipe(fs.createWriteStream('./doodle.png'))

rp('https://baikebcs.bdimg.com/adpic/jiangfangzhou.png').then(data => {
  console.log(data);
})

let cjy = new Chaojiying('179817004', 'Mailofchaojiying*');

cjy.getScore().then(data => {
  console.log(data);
})