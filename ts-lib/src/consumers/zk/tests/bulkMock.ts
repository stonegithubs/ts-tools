import Mongo from '../../../lib/mongo/';
import { getRandomInt, log } from '../../../lib/utils';
import ZK from '../zk';

let mongo = new Mongo();

function autoMock():void {
    mongo.getCollection('zk', 'regists').then(col => {
        // let query = {signed:{$lte:1}};
        let cur = col.find();
        let count = 0;
        cur.forEach((item) => {
            count++;
            log(`当前第\t${count}\t条数据`);
            let zk = new ZK(item.txtCode, item.txtUserName, item.txtPassword);  // '00TPBBT'
            let randTime = getRandomInt(1000 * 60 * 16) as number;   // 12 小时内完成
            log(`将在\t${randTime/1000}\t秒钟之后模拟用户操作！`);

            setTimeout(async () => {
                await zk.login();
                col.updateOne(item, { $inc: { signed: 1 }});
            }, randTime);
        });
    })
}

autoMock();
setInterval(autoMock, 1000 * 3600 * 24);  // 24小时执行一次