import Mongo from '../../../lib/mongo/';
import Epnex from '../epnex';
import { getRandomInt, log } from '../../../lib/utils';

let mongo = new Mongo();

mongo.getCollection('epnex', 'regists').then(col => {
    let cur = col.find();
    cur.forEach(item => {
        let ep = new Epnex(item.invitation);  // '00TPBBT'
        let randTime = getRandomInt(3600 * 10);
        log(`将在\t${randTime}\t秒钟之后模拟用户操作！`);
        setTimeout(async () => {
            await ep.login(item.user_email, item.user_password);
            ep.mockOperation();
        }, randTime * 1000);
    });
})
