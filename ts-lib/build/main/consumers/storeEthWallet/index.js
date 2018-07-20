"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_1 = __importDefault(require("../../lib/koa"));
const mongo_1 = __importDefault(require("../../lib/mongo"));
new koa_1.default([{
        path: '/',
        method: 'post',
        cb: async (ctx) => {
            let data = ctx.request.body;
            await mongo_1.default.store('eth', 'wallets', data);
            ctx.body = '存储成功！';
        }
    }]).listen(9999);
// for (let i = 0; i < 100; i++) {
//   var password = 'zhangjianjun';
//   var wallet = Wallet.generate(false);
//   var privateKey = wallet.getPrivateKeyString();
//   var keyStore = wallet.toV3(password, {
//     kdf: globalFuncs.kdf,
//     n: globalFuncs.scrypt.n
//   });
//   console.log(wallet);
//   fetch('http://localhost:9999', {
//     method: 'post',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({ privateKey, ...keyStore, password })
//   }).then(d => console.log(d), j => console.log(j));
// }
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29uc3VtZXJzL3N0b3JlRXRoV2FsbGV0L2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsd0RBQWtDO0FBQ2xDLDREQUFpRDtBQUVqRCxJQUFJLGFBQUssQ0FBQyxDQUFDO1FBQ1QsSUFBSSxFQUFFLEdBQUc7UUFDVCxNQUFNLEVBQUUsTUFBTTtRQUNkLEVBQUUsRUFBRSxLQUFLLEVBQUMsR0FBRyxFQUFDLEVBQUU7WUFDZCxJQUFJLElBQUksR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztZQUM1QixNQUFNLGVBQWtCLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDdkQsR0FBRyxDQUFDLElBQUksR0FBRyxPQUFPLENBQUM7UUFDckIsQ0FBQztLQUNGLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQTtBQUdoQixrQ0FBa0M7QUFDbEMsbUNBQW1DO0FBQ25DLHlDQUF5QztBQUN6QyxtREFBbUQ7QUFDbkQsMkNBQTJDO0FBQzNDLDRCQUE0QjtBQUM1Qiw4QkFBOEI7QUFDOUIsUUFBUTtBQUNSLHlCQUF5QjtBQUN6QixxQ0FBcUM7QUFDckMsc0JBQXNCO0FBQ3RCLGlCQUFpQjtBQUNqQiwyQ0FBMkM7QUFDM0MsU0FBUztBQUNULGtFQUFrRTtBQUNsRSx1REFBdUQ7QUFDdkQsSUFBSSJ9