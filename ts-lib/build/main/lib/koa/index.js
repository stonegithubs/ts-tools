"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("@koa/cors"));
const koa_1 = __importDefault(require("koa"));
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
const koa_router_1 = __importDefault(require("koa-router"));
const koa_serve_static_1 = __importDefault(require("koa-serve-static"));
class MyKoa {
    constructor(routes, staticDir) {
        const app = new koa_1.default();
        const router = new koa_router_1.default();
        routes.forEach(el => {
            router[el.method](el.path, el.cb);
        });
        console.log(staticDir);
        app
            .use(cors_1.default())
            .use(koa_bodyparser_1.default())
            .use(router.routes())
            .use(koa_serve_static_1.default(staticDir));
        this.app = app;
        this.router = router;
    }
    listen(port, fn) {
        let { app } = this;
        try {
            app.listen(port, fn && fn.bind(null, port));
        }
        catch (error) {
            console.error(error);
            throw error;
        }
        return app;
    }
}
exports.default = MyKoa;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL2tvYS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLHFEQUE2QjtBQUM3Qiw4Q0FBc0I7QUFDdEIsb0VBQXdDO0FBQ3hDLDREQUFtQztBQUNuQyx3RUFBMkM7QUFFM0M7SUFHRSxZQUFZLE1BQTBCLEVBQUUsU0FBa0I7UUFDeEQsTUFBTSxHQUFHLEdBQUcsSUFBSSxhQUFHLEVBQUUsQ0FBQztRQUN0QixNQUFNLE1BQU0sR0FBRyxJQUFJLG9CQUFTLEVBQUUsQ0FBQztRQUMvQixNQUFNLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxFQUFFO1lBQ2xCLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDcEMsQ0FBQyxDQUFDLENBQUE7UUFDRixPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBRXZCLEdBQUc7YUFDQSxHQUFHLENBQUMsY0FBSSxFQUFFLENBQUM7YUFDWCxHQUFHLENBQUMsd0JBQVUsRUFBRSxDQUFDO2FBQ2pCLEdBQUcsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUM7YUFDcEIsR0FBRyxDQUFDLDBCQUFXLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQTtRQUU5QixJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztRQUNmLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0lBQ3ZCLENBQUM7SUFDTSxNQUFNLENBQUMsSUFBWSxFQUFFLEVBQWlDO1FBQzNELElBQUksRUFBRSxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUM7UUFDbkIsSUFBSTtZQUNGLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO1NBQzdDO1FBQUMsT0FBTyxLQUFLLEVBQUU7WUFDZCxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3JCLE1BQU0sS0FBSyxDQUFDO1NBQ2I7UUFDRCxPQUFPLEdBQUcsQ0FBQztJQUNiLENBQUM7Q0FDRjtBQTlCRCx3QkE4QkMifQ==