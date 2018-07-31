import Mongo from '../../../lib/mongo/';
import ZK from '../zk';
import { getRandomInt } from '../../../lib/utils';


new Mongo().getCollection('zk', 'regists').then(col => {
  let count = 1;
  col.find({txtCode: '3E3C23A511B835C'}).limit(getRandomInt(20, 5)).forEach(el => {
    let zk = new ZK(el.txtCode);
    zk.task(count++);
  })
})