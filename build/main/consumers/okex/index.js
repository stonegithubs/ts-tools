"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_1 = __importDefault(require("../../lib/koa"));
const strategy1_1 = __importDefault(require("./strategy1"));
let users = {};
new koa_1.default([
    {
        method: 'get', path: '/run', cb: (ctx) => {
            let { key, secret, stop, coinFrom = 'okb', coinTo = 'usdt' } = ctx.query;
            if (key && secret) {
                let user = key + '|' + secret;
                if (users[user]) {
                    if (stop) {
                        users[user].stop();
                        users[user] = undefined;
                        ctx.body = '已停止！';
                    }
                    else {
                        ctx.body = '用户已经添加， 无需重复添加！';
                    }
                }
                else {
                    let okex = new strategy1_1.default(key, secret);
                    users[user] = okex;
                    okex.wsLogin();
                    okex.task(coinFrom, coinTo, '1min');
                    ctx.body = '用户添加成功！';
                }
            }
            else {
                ctx.body = '必须传入 key 和 secret！';
            }
        }
    }
]).listen(8889);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29uc3VtZXJzL29rZXgvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSx3REFBZ0M7QUFDaEMsNERBQStCO0FBRS9CLElBQUksS0FBSyxHQUFHLEVBQVMsQ0FBQztBQUV0QixJQUFJLGFBQUcsQ0FBQztJQUNKO1FBQ0UsTUFBTSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFO1lBQ3JDLElBQUksRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxRQUFRLEdBQUcsS0FBSyxFQUFFLE1BQU0sR0FBRyxNQUFNLEVBQUUsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDO1lBQ3pFLElBQUksR0FBRyxJQUFJLE1BQU0sRUFBRTtnQkFDZixJQUFJLElBQUksR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLE1BQU0sQ0FBQztnQkFDOUIsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUU7b0JBQ2IsSUFBSSxJQUFJLEVBQUU7d0JBQ1IsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO3dCQUNuQixLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsU0FBUyxDQUFDO3dCQUN4QixHQUFHLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQztxQkFDbkI7eUJBQU07d0JBQ0wsR0FBRyxDQUFDLElBQUksR0FBRyxpQkFBaUIsQ0FBQztxQkFDOUI7aUJBQ0o7cUJBQU07b0JBQ0osSUFBSSxJQUFJLEdBQUcsSUFBSSxtQkFBSSxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsQ0FBQztvQkFDakMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQztvQkFDbkIsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO29CQUNmLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztvQkFDcEMsR0FBRyxDQUFDLElBQUksR0FBRyxTQUFTLENBQUM7aUJBQ3ZCO2FBQ0o7aUJBQU07Z0JBQ0gsR0FBRyxDQUFDLElBQUksR0FBRyxvQkFBb0IsQ0FBQzthQUNuQztRQUNMLENBQUM7S0FDRjtDQUNGLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMifQ==