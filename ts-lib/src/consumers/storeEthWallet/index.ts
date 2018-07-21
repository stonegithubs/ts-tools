import MyKoa from "../../lib/koa";
import MongoClientManager from "../../lib/mongo";

new MyKoa([{
  path: '/',
  method: 'post',
  cb: async ctx => {
    let data = ctx.request.body;
    await MongoClientManager.store('eth', 'wallets', data);
    ctx.body = '存储成功！';
  }
}]).listen(9999)

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
