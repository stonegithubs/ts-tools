import colors from 'colors';
import { getRandomInt, log } from '../../../lib/utils';
import ZK from '../zk';

let count = 0;
let max = 100;

function run(): void {
    count++;
    if (count > max) return;
    let zk = new ZK('D2480D');
    zk.task(count);
    let randTime = getRandomInt(10, 3) as number;
    log(`${randTime}分钟以后执行下一次操作`);
    setTimeout(() => {
        run();
    }, randTime * 1000 * 60);
}

run();