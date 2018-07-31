import Mongo from '../../../lib/mongo/';
import ZK from '../zk';
import { getRandomInt } from '../../../lib/utils';


new Mongo().getCollection('zk', 'regists').then(async col => {
  let count = 1;
  col.find({txtCode: 'D2480D'}).limit(getRandomInt(20, 5)).skip(getRandomInt(200)).forEach(async el => {
    let zk = new ZK(el.txtCode, el.txtUserName, el.txtPassword);
    let inviteCode = await zk.getInviteCode();
    if (inviteCode) {
       let regZk = new ZK(inviteCode);
       regZk.task(count++);
    }
  })
})