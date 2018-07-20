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
            mongo_1.default.store('eth', 'wallets', data);
        }
    }]).listen(9999);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29uc3VtZXJzL3N0b3JlRXRoV2FsbGV0L2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsd0RBQWtDO0FBQ2xDLDREQUFpRDtBQUVqRCxJQUFJLGFBQUssQ0FBQyxDQUFDO1FBQ1QsSUFBSSxFQUFFLEdBQUc7UUFDVCxNQUFNLEVBQUUsTUFBTTtRQUNkLEVBQUUsRUFBRSxLQUFLLEVBQUMsR0FBRyxFQUFDLEVBQUU7WUFDZCxJQUFJLElBQUksR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztZQUM1QixlQUFrQixDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ25ELENBQUM7S0FDRixDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUEifQ==