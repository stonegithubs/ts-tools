import MyKoa from "../../lib/koa";
import MongoClientManager from "../../lib/mongo";

new MyKoa([{
  path: '/',
  method: 'post',
  cb: async ctx => {
    let data = ctx.request.body;
    MongoClientManager.store('eth', 'wallets', data);
  }
}]).listen(9999)


// for (let i = 0; i < 100; i++) {
//   var password = 'zhangjianjun';
//   var a = Wallet.generate(false).toV3(password, {
//     kdf: globalFuncs.kdf,
//     n: globalFuncs.scrypt.n
//   });
//   console.log(a);
//   fetch('http://localhost:9999', {
//     method: 'post',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify(a)
//   }).then(d => console.log(d), j => console.log(j));
// }