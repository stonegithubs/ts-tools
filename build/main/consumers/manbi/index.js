"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const stratege1_1 = __importDefault(require("./stratege1"));
const koa_1 = __importDefault(require("../../lib/koa"));
let users = {};
new koa_1.default([
    {
        method: 'get', path: '/run', cb: (ctx) => {
            let { apiid, secret, buyNum, sellNum, disparityLimit, timelimit, taskInterval, stop } = ctx.query;
            if (apiid && secret) {
                let user = apiid + '|' + secret;
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
                    let manbi = new stratege1_1.default(apiid, secret, buyNum, sellNum, disparityLimit, timelimit, taskInterval);
                    users[user] = manbi;
                    manbi.run();
                    ctx.body = '用户添加成功！';
                }
            }
            else {
                ctx.body = '必须传入 apiid 和 secret！';
            }
        }
    }
]).listen(3000);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29uc3VtZXJzL21hbmJpL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsNERBQWdDO0FBQ2hDLHdEQUFnQztBQUVoQyxJQUFJLEtBQUssR0FBRyxFQUFTLENBQUM7QUFFdEIsSUFBSSxhQUFHLENBQUM7SUFDSjtRQUNFLE1BQU0sRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxFQUFFLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRTtZQUNyQyxJQUFJLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLGNBQWMsRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRSxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUM7WUFDbEcsSUFBSSxLQUFLLElBQUksTUFBTSxFQUFFO2dCQUNqQixJQUFJLElBQUksR0FBRyxLQUFLLEdBQUcsR0FBRyxHQUFHLE1BQU0sQ0FBQztnQkFDaEMsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUU7b0JBQ2IsSUFBSSxJQUFJLEVBQUU7d0JBQ1IsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO3dCQUNuQixLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsU0FBUyxDQUFDO3dCQUN4QixHQUFHLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQztxQkFDbkI7eUJBQU07d0JBQ0wsR0FBRyxDQUFDLElBQUksR0FBRyxpQkFBaUIsQ0FBQztxQkFDOUI7aUJBQ0o7cUJBQU07b0JBQ0osSUFBSSxLQUFLLEdBQUcsSUFBSSxtQkFBSyxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxjQUFjLEVBQUUsU0FBUyxFQUFFLFlBQVksQ0FBQyxDQUFDO29CQUMvRixLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDO29CQUNwQixLQUFLLENBQUMsR0FBRyxFQUFFLENBQUM7b0JBQ1osR0FBRyxDQUFDLElBQUksR0FBRyxTQUFTLENBQUM7aUJBQ3ZCO2FBQ0o7aUJBQU07Z0JBQ0gsR0FBRyxDQUFDLElBQUksR0FBRyxzQkFBc0IsQ0FBQzthQUNyQztRQUNMLENBQUM7S0FDRjtDQUNGLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMifQ==