"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("@koa/cors"));
const koa_1 = __importDefault(require("koa"));
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
const koa_router_1 = __importDefault(require("koa-router"));
class MyKoa {
    constructor(routes) {
        const app = new koa_1.default();
        const router = new koa_router_1.default();
        routes.forEach(el => {
            router[el.method](el.path, el.cb);
        });
        app
            .use(cors_1.default())
            .use(koa_bodyparser_1.default())
            .use(router.routes());
        this.app = app;
        this.router = router;
    }
    listen(port, fn) {
        try {
            this.app.listen(port, fn && fn.bind(null, port));
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }
}
exports.default = MyKoa;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL2tvYS9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLHFEQUE2QjtBQUM3Qiw4Q0FBc0I7QUFDdEIsb0VBQXdDO0FBQ3hDLDREQUFtQztBQUVuQztJQUdFLFlBQVksTUFBMEI7UUFDcEMsTUFBTSxHQUFHLEdBQUcsSUFBSSxhQUFHLEVBQUUsQ0FBQztRQUN0QixNQUFNLE1BQU0sR0FBRyxJQUFJLG9CQUFTLEVBQUUsQ0FBQztRQUMvQixNQUFNLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxFQUFFO1lBQ2xCLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDcEMsQ0FBQyxDQUFDLENBQUE7UUFFRixHQUFHO2FBQ0EsR0FBRyxDQUFDLGNBQUksRUFBRSxDQUFDO2FBQ1gsR0FBRyxDQUFDLHdCQUFVLEVBQUUsQ0FBQzthQUNqQixHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7UUFFeEIsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7UUFDZixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztJQUN2QixDQUFDO0lBQ00sTUFBTSxDQUFDLElBQVksRUFBRSxFQUFpQztRQUMzRCxJQUFJO1lBQ0YsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO1NBQ2xEO1FBQUMsT0FBTyxLQUFLLEVBQUU7WUFDZCxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3JCLE1BQU0sS0FBSyxDQUFDO1NBQ2I7SUFDSCxDQUFDO0NBQ0Y7QUExQkQsd0JBMEJDIn0=