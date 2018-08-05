import Koa from '../../../lib/koa';
import { ObjectID } from 'mongodb';
import Mongo from '../../../lib/mongo/';
import reverseConf from '../../../conf/reverseProxyConf';
import { log, getRandomInt } from '../../../lib/utils';
import { Task } from '../../../lib/utils/task.namespace';

let mongo = new Mongo();
let max = 100;
let running = {}

new Koa([
    {
        method: 'get',
        path: '/',
        cb: async (ctx): Promise<any> => {
            let col = await mongo.getCollection('gift', 'regists');
            // let data = await col.findOneAndUpdate({ picked: { $exists: false } }, { $inc: { picked: 1 } }, { upsert: true });
            let data = await col.findOne({ picked: { $exists: false }});
            ctx.body = data;
        }
    },{
        method: 'post',
        path: '/',
        cb: async (ctx): Promise<any> => {
            let { _id } = ctx.request.body;
            if (_id) {
                let col = await mongo.getCollection('gift', 'regists');
                let data = await col.updateOne({ _id: ObjectID(_id) }, {$inc: { picked: 1 }}, {upsert:true});
                ctx.body = {
                    status: 1,
                    data
                }
            } else{
                ctx.body = {
                    status: 0,
                    msg: '没有id'
                }
            }
        }
    }
]).listen(reverseConf.Gift.port, function () {
    log(`在端口${reverseConf.Gift.port}侦听成功!`);
});


// async function submitOne(data){
//     if (!data) {
//         data = await $.get(`http://localhost:26672?t=${Date.now()}`);
//     }
//     if (data) {
//       let result = await $.post('/Finance/upmyzr.html', {
//           coin: 'gift',
//           num: '1000',
//           paypassword: 199381,
//           addr: '0xf54A7f2312b4e994F72A63e2E738725D7609A59F',
//           outaddr: data.address
//       })
//       result._id = data._id;
//       return result;
//     } else {
//         return new Promise(res => setTimeout(res, 1000));
//     }
//   }
  
//   async function task() {
//       let result;
//       do {
//           result = await submitOne();
//           console.log(result);
//           if (result&&result.status) {
//               let updateResult = await $.post(`http://localhost:26672?t=${Date.now()}`, { _id: result._id });
//               if (!updateResult.status) {
//                   break;
//               }
//           }
//       } while (true);
//   }
// task()

// async function getAll() {
//     let result = await $.get(`http://localhost:26672/all?t=${Date.now()}`);
//     let arr = []
//     if (result&&result.data) {
//         result.data.forEach(el => {
//             let submitResult = $.post('/Finance/upmyzr.html', {
//                 coin: 'gift',
//                 num: '1000',
//                 paypassword: 199381,
//                 addr: '0xf54A7f2312b4e994F72A63e2E738725D7609A59F',
//                 outaddr: el.address
//             })
//             arr.push(submitResult);
//         });
//     }
//     return Promise.all(arr);
// }

// async function task2() {
//     let ret;
//     while(await getAll() || true) {

//     }
// }
