import Mongo from '../../../lib/mongo/';
import { getRandomInt, log } from '../../../lib/utils';
import Epnex from '../epnex';

let mongo = new Mongo();

function autoMock():void {
    mongo.getCollection('epnex', 'regists').then(col => {
        // let query = {signed:{$lte:2}};
        let cur = col.find();
        let count = 0;
        cur.forEach((item) => {
            count++;
            log(`当前第\t${count}\t条数据`);
            let ep = new Epnex(item.invitation);  // '00TPBBT'
            let randTime = getRandomInt(1000 * 60 * 60 * 5) as number;   // 12 小时内完成
            log(`将在\t${randTime / 1000}\t秒钟之后模拟用户操作！`, 'warn');

            setTimeout(async () => {
                await ep.login(item.user_email, item.user_password);
                ep.mockOperation();
                col.updateOne(item, { $inc: { signed: 1 }});
            }, randTime);
        });
    })
}

autoMock();
setInterval(autoMock, 1000 * 3600 * 19);  // 19小时执行一次