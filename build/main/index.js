"use strict";
// export * from './lib/async';
// export * from './lib/hash';
// export * from './lib/number';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_1 = __importDefault(require("./lib/request"));
const koa_1 = __importDefault(require("./lib/koa"));
async function go() {
    try {
        let req = new request_1.default();
        await req.workFlow('http://chosan.cn');
        await req.workFlow('http://localhost:8080/test/2');
        console.log(req.data);
    }
    catch (error) {
        console.log(error);
    }
}
let server = new koa_1.default([
    {
        method: 'get', path: '/test/:id', cb: (ctx) => {
            ctx.body = ctx.params.id;
        }
    },
    {
        method: 'post', path: '/test', cb: (ctx) => {
            console.log(ctx.request.body);
        }
    }
]);
server.listen(8080, port => {
    console.log(`服务器启动成功, 端口:\t${port}`);
});
go();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLCtCQUErQjtBQUMvQiw4QkFBOEI7QUFDOUIsZ0NBQWdDOzs7OztBQUVoQyw0REFBZ0M7QUFDaEMsb0RBQTRCO0FBRTVCLEtBQUs7SUFDSCxJQUFJO1FBQ0YsSUFBSSxHQUFHLEdBQUcsSUFBSSxpQkFBRyxFQUFFLENBQUM7UUFDcEIsTUFBTSxHQUFHLENBQUMsUUFBUSxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFDdkMsTUFBTSxHQUFHLENBQUMsUUFBUSxDQUFDLDhCQUE4QixDQUFDLENBQUE7UUFDbEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUE7S0FDdEI7SUFBQyxPQUFPLEtBQUssRUFBRTtRQUNkLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUE7S0FDbkI7QUFDSCxDQUFDO0FBRUQsSUFBSSxNQUFNLEdBQUcsSUFBSSxhQUFHLENBQUM7SUFDbkI7UUFDRSxNQUFNLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsRUFBRSxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUU7WUFDNUMsR0FBRyxDQUFDLElBQUksR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQztRQUMzQixDQUFDO0tBQ0Y7SUFDRDtRQUNFLE1BQU0sRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxFQUFFLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRTtZQUN6QyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDL0IsQ0FBQztLQUNGO0NBQ0YsQ0FBQyxDQUFBO0FBRUYsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEVBQUU7SUFDekIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUN2QyxDQUFDLENBQUMsQ0FBQTtBQUVGLEVBQUUsRUFBRSxDQUFBIn0=