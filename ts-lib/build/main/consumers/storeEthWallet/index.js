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
// do {
//   let bulk = [];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29uc3VtZXJzL3N0b3JlRXRoV2FsbGV0L2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsd0RBQWtDO0FBQ2xDLDREQUFpRDtBQUVqRCxJQUFJLGFBQUssQ0FBQyxDQUFDO1FBQ1QsSUFBSSxFQUFFLEdBQUc7UUFDVCxNQUFNLEVBQUUsTUFBTTtRQUNkLEVBQUUsRUFBRSxLQUFLLEVBQUMsR0FBRyxFQUFDLEVBQUU7WUFDZCxJQUFJLElBQUksR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztZQUM1QixNQUFNLGVBQWtCLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDdkQsR0FBRyxDQUFDLElBQUksR0FBRyxPQUFPLENBQUM7UUFDckIsQ0FBQztLQUNGLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQTtBQUVoQixPQUFPO0FBQ1AsbUJBQW1CO0FBQ25CLGtDQUFrQztBQUNsQyxxQ0FBcUM7QUFDckMsMkNBQTJDO0FBQzNDLHFEQUFxRDtBQUNyRCw2Q0FBNkM7QUFDN0MsOEJBQThCO0FBQzlCLGdDQUFnQztBQUNoQyxVQUFVO0FBQ1Ysd0RBQXdEO0FBQ3hELE1BQU07QUFDTixxQ0FBcUM7QUFDckMsc0JBQXNCO0FBQ3RCLGlCQUFpQjtBQUNqQiwyQ0FBMkM7QUFDM0MsU0FBUztBQUNULGlDQUFpQztBQUNqQyx1REFBdUQ7QUFDdkQsbUJBQW1CIn0=