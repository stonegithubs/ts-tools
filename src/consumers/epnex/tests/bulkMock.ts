import Mongo from '../../../lib/mongo/';
import { getRandomInt, log } from '../../../lib/utils';
import Epnex from '../epnex';

let mongo = new Mongo();

function autoMock():void {
    mongo.getCollection('epnex', 'regists').then(col => {
        let cur = col.find({signed:{$lte:1}});
        let count = 0;
        cur.forEach((item) => {
            count++;
            log(`当前第\t${count}\t条数据`);
            let ep = new Epnex(item.invitation);  // '00TPBBT'
            let randTime = getRandomInt(10) as number;   // 12 小时内完成
            log(`将在\t${randTime}\t秒钟之后模拟用户操作！`);

            setTimeout(async () => {
                await ep.login(item.user_email, item.user_password);
                ep.mockOperation();
                col.updateOne(item, { $inc: { signed: 1 }});
            }, randTime * 1000);
        });
    })
}

autoMock();
setInterval(autoMock, 1000 * 3600 * 24);  // 24小时执行一次