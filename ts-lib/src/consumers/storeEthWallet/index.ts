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
