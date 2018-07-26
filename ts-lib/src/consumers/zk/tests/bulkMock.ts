import Mongo from '../../../lib/mongo/';
import { getRandomInt, log } from '../../../lib/utils';
import ZK from '../zk';

let mongo = new Mongo();

function autoMock():void {
    mongo.getCollection('zk', 'regists').then(col => {
        // let query = {signed:{$lte:1}};
        let cur = col.find();
        let count = 0;
        let success = 0;
        cur.forEach((item) => {
            log(`当前第\t${count}\t条数据`);
            let zk = new ZK(item.txtCode, item.txtUserName, item.txtPassword);  // '00TPBBT'
            let randTime = getRandomInt(1000) as number;
            log(`将在\t${randTime / 1000}\t秒钟之后模拟用户操作！`);
            // count <= 10 &&
            setTimeout(async () => {
                count++;
                await zk.login(count);
                log(`${'-'.repeat(20)}\n成功${++success}条\n${'-'.repeat(20)}`, 'warn');
                col.updateOne(item, { $inc: { signed: 1 }});
            }, randTime);
        });
    })
}

autoMock();
setInterval(autoMock, 1000 * 3600 * 20);  // 20小时执行一次