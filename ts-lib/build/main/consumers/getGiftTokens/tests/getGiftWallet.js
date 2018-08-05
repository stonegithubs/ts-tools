"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_1 = __importDefault(require("../../../lib/koa"));
const mongodb_1 = require("mongodb");
const mongo_1 = __importDefault(require("../../../lib/mongo/"));
const reverseProxyConf_1 = __importDefault(require("../../../conf/reverseProxyConf"));
const utils_1 = require("../../../lib/utils");
let mongo = new mongo_1.default();
let max = 100;
let running = {};
new koa_1.default([
    {
        method: 'get',
        path: '/',
        cb: async (ctx) => {
            let col = await mongo.getCollection('gift', 'regists');
            // let data = await col.findOneAndUpdate({ picked: { $exists: false } }, { $inc: { picked: 1 } }, { upsert: true });
            let data = await col.findOne({ picked: { $exists: false } });
            ctx.body = data;
        }
    }, {
        method: 'post',
        path: '/',
        cb: async (ctx) => {
            let { _id } = ctx.request.body;
            if (_id) {
                let col = await mongo.getCollection('gift', 'regists');
                let data = await col.updateOne({ _id: mongodb_1.ObjectID(_id) }, { $inc: { picked: 1 } }, { upsert: true });
                ctx.body = {
                    status: 1,
                    data
                };
            }
            else {
                ctx.body = {
                    status: 0,
                    msg: '没有id'
                };
            }
        }
    }
]).listen(reverseProxyConf_1.default.Gift.port, function () {
    utils_1.log(`在端口${reverseProxyConf_1.default.Gift.port}侦听成功!`);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0R2lmdFdhbGxldC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9jb25zdW1lcnMvZ2V0R2lmdFRva2Vucy90ZXN0cy9nZXRHaWZ0V2FsbGV0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsMkRBQW1DO0FBQ25DLHFDQUFtQztBQUNuQyxnRUFBd0M7QUFDeEMsc0ZBQXlEO0FBQ3pELDhDQUF1RDtBQUd2RCxJQUFJLEtBQUssR0FBRyxJQUFJLGVBQUssRUFBRSxDQUFDO0FBQ3hCLElBQUksR0FBRyxHQUFHLEdBQUcsQ0FBQztBQUNkLElBQUksT0FBTyxHQUFHLEVBQUUsQ0FBQTtBQUVoQixJQUFJLGFBQUcsQ0FBQztJQUNKO1FBQ0ksTUFBTSxFQUFFLEtBQUs7UUFDYixJQUFJLEVBQUUsR0FBRztRQUNULEVBQUUsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFnQixFQUFFO1lBQzVCLElBQUksR0FBRyxHQUFHLE1BQU0sS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFDdkQsb0hBQW9IO1lBQ3BILElBQUksSUFBSSxHQUFHLE1BQU0sR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLE1BQU0sRUFBRSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsRUFBQyxDQUFDLENBQUM7WUFDNUQsR0FBRyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDcEIsQ0FBQztLQUNKLEVBQUM7UUFDRSxNQUFNLEVBQUUsTUFBTTtRQUNkLElBQUksRUFBRSxHQUFHO1FBQ1QsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQWdCLEVBQUU7WUFDNUIsSUFBSSxFQUFFLEdBQUcsRUFBRSxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO1lBQy9CLElBQUksR0FBRyxFQUFFO2dCQUNMLElBQUksR0FBRyxHQUFHLE1BQU0sS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUM7Z0JBQ3ZELElBQUksSUFBSSxHQUFHLE1BQU0sR0FBRyxDQUFDLFNBQVMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxrQkFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsRUFBQyxJQUFJLEVBQUUsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUMsRUFBRSxFQUFDLE1BQU0sRUFBQyxJQUFJLEVBQUMsQ0FBQyxDQUFDO2dCQUM3RixHQUFHLENBQUMsSUFBSSxHQUFHO29CQUNQLE1BQU0sRUFBRSxDQUFDO29CQUNULElBQUk7aUJBQ1AsQ0FBQTthQUNKO2lCQUFLO2dCQUNGLEdBQUcsQ0FBQyxJQUFJLEdBQUc7b0JBQ1AsTUFBTSxFQUFFLENBQUM7b0JBQ1QsR0FBRyxFQUFFLE1BQU07aUJBQ2QsQ0FBQTthQUNKO1FBQ0wsQ0FBQztLQUNKO0NBQ0osQ0FBQyxDQUFDLE1BQU0sQ0FBQywwQkFBVyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUU7SUFDN0IsV0FBRyxDQUFDLE1BQU0sMEJBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxPQUFPLENBQUMsQ0FBQztBQUM1QyxDQUFDLENBQUMsQ0FBQztBQUdILGtDQUFrQztBQUNsQyxtQkFBbUI7QUFDbkIsd0VBQXdFO0FBQ3hFLFFBQVE7QUFDUixrQkFBa0I7QUFDbEIsNERBQTREO0FBQzVELDBCQUEwQjtBQUMxQix5QkFBeUI7QUFDekIsaUNBQWlDO0FBQ2pDLGdFQUFnRTtBQUNoRSxrQ0FBa0M7QUFDbEMsV0FBVztBQUNYLCtCQUErQjtBQUMvQix1QkFBdUI7QUFDdkIsZUFBZTtBQUNmLDREQUE0RDtBQUM1RCxRQUFRO0FBQ1IsTUFBTTtBQUVOLDRCQUE0QjtBQUM1QixvQkFBb0I7QUFDcEIsYUFBYTtBQUNiLHdDQUF3QztBQUN4QyxpQ0FBaUM7QUFDakMseUNBQXlDO0FBQ3pDLGdIQUFnSDtBQUNoSCw0Q0FBNEM7QUFDNUMsMkJBQTJCO0FBQzNCLGtCQUFrQjtBQUNsQixjQUFjO0FBQ2Qsd0JBQXdCO0FBQ3hCLE1BQU07QUFDTixTQUFTO0FBRVQsNEJBQTRCO0FBQzVCLDhFQUE4RTtBQUM5RSxtQkFBbUI7QUFDbkIsaUNBQWlDO0FBQ2pDLHNDQUFzQztBQUN0QyxrRUFBa0U7QUFDbEUsZ0NBQWdDO0FBQ2hDLCtCQUErQjtBQUMvQix1Q0FBdUM7QUFDdkMsc0VBQXNFO0FBQ3RFLHNDQUFzQztBQUN0QyxpQkFBaUI7QUFDakIsc0NBQXNDO0FBQ3RDLGNBQWM7QUFDZCxRQUFRO0FBQ1IsK0JBQStCO0FBQy9CLElBQUk7QUFFSiwyQkFBMkI7QUFDM0IsZUFBZTtBQUNmLHNDQUFzQztBQUV0QyxRQUFRO0FBQ1IsSUFBSSJ9