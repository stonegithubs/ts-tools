import ZK from '../zk';

let count = 0;
let max = 10;

function run() {
    count++;
    if (count > max) return;
    let zk = new ZK('0TP4R4');
    zk.task(count);
    setTimeout(() => {
        run();
    }, 4000);
}

run();