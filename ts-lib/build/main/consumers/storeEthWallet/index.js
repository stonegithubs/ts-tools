"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_1 = __importDefault(require("../../lib/koa"));
const mongo_1 = __importDefault(require("../../lib/mongo"));
const reverseProxyConf_1 = __importDefault(require("../../conf/reverseProxyConf"));
new koa_1.default([
    {
        path: '/',
        method: 'post',
        cb: async (ctx) => {
            let data = ctx.request.body;
            let result = await mongo_1.default.store('eth', 'wallets', data);
            ctx.body = JSON.stringify({
                status: 1,
                msg: `存储成功！写入${result.insertedCount}条数据`,
                result: result.result
            });
        }
    }
], __dirname + '/static/').listen(reverseProxyConf_1.default.ETH.port);
// let bulk;
// do {
//   bulk = [];
//   for (let i = 0; i < 2; i++) {
//     var password = 'zhangjianjun';
//     var wallet = Wallet.generate(false);
//     var privateKey = wallet.getPrivateKeyString();
//     var keyStore = wallet.toV3(password, {
//       kdf: globalFuncs.kdf,
//       n: globalFuncs.scrypt.n
//     });
//     bulk.push({ privateKey, ...keyStore, password });
//   }
//   fetch('http://localhost:9999', {
//     method: 'post',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify(bulk)
//   }).then(d => console.log(d), j => console.log(j));
// } while (false);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29uc3VtZXJzL3N0b3JlRXRoV2FsbGV0L2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsd0RBQWtDO0FBQ2xDLDREQUFpRDtBQUNqRCxtRkFBc0Q7QUFFdEQsSUFBSSxhQUFLLENBQUM7SUFDUjtRQUNBLElBQUksRUFBRSxHQUFHO1FBQ1QsTUFBTSxFQUFFLE1BQU07UUFDZCxFQUFFLEVBQUUsS0FBSyxFQUFDLEdBQUcsRUFBQyxFQUFFO1lBQ2QsSUFBSSxJQUFJLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7WUFDNUIsSUFBSSxNQUFNLEdBQUcsTUFBTSxlQUFrQixDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ3BFLEdBQUcsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztnQkFDeEIsTUFBTSxFQUFFLENBQUM7Z0JBQ1QsR0FBRyxFQUFFLFVBQVUsTUFBTSxDQUFDLGFBQWEsS0FBSztnQkFDeEMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxNQUFNO2FBQ3RCLENBQUMsQ0FBQztRQUNMLENBQUM7S0FDRjtDQUFDLEVBQUUsU0FBUyxHQUFHLFVBQVUsQ0FBQyxDQUFDLE1BQU0sQ0FBQywwQkFBVyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUV6RCxZQUFZO0FBQ1osT0FBTztBQUNQLGVBQWU7QUFDZixrQ0FBa0M7QUFDbEMscUNBQXFDO0FBQ3JDLDJDQUEyQztBQUMzQyxxREFBcUQ7QUFDckQsNkNBQTZDO0FBQzdDLDhCQUE4QjtBQUM5QixnQ0FBZ0M7QUFDaEMsVUFBVTtBQUNWLHdEQUF3RDtBQUN4RCxNQUFNO0FBQ04scUNBQXFDO0FBQ3JDLHNCQUFzQjtBQUN0QixpQkFBaUI7QUFDakIsMkNBQTJDO0FBQzNDLFNBQVM7QUFDVCxpQ0FBaUM7QUFDakMsdURBQXVEO0FBQ3ZELG1CQUFtQiJ9