"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_1 = __importDefault(require("../../request"));
class Geetest {
    constructor(user, pass) {
        this.user = user;
        this.pass = pass;
        this.requester = new request_1.default('http://jiyanapi.c2567.com', { json: true });
    }
    getData(url, data, method = 'get', params = {}) {
        let { requester } = this;
        return requester.workFlow(url, data, method, params);
    }
    validate(params) {
        // http://jiyanapi.c2567.com/shibie?
        // gt=请输入gt参数&
        // challenge=请输入challenge参数
        // &referer=请输入来源地址参数&
        // user=test&
        // pass=test&
        // return=json&
        // model=3
        let { user, pass } = this;
        switch (params.success) {
            case 1:
                params.model = 3;
                break;
            case 0:
                params.model = 4;
                break;
            default:
                break;
        }
        return this.getData('/shibie', Object.assign({ user, pass, return: 'json', devuser: 'chosan' }, params));
    }
}
exports.default = Geetest;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VldGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9saWIvY2FwdGNoYVZhbGlkYXRvcnMvZ2VldGVzdC9nZWV0ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBRUEsNERBQWtDO0FBR2xDO0lBU0UsWUFBc0IsSUFBSSxFQUFZLElBQUk7UUFBcEIsU0FBSSxHQUFKLElBQUksQ0FBQTtRQUFZLFNBQUksR0FBSixJQUFJLENBQUE7UUFQMUMsY0FBUyxHQUFHLElBQUksaUJBQUssQ0FBQywyQkFBMkIsRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBT3BCLENBQUM7SUFMaEQsT0FBTyxDQUFDLEdBQUcsRUFBRSxJQUFLLEVBQUUsTUFBTSxHQUFHLEtBQUssRUFBRSxTQUFjLEVBQUU7UUFDbEQsSUFBSyxFQUFFLFNBQVMsRUFBRSxHQUFHLElBQUksQ0FBQztRQUMxQixPQUFPLFNBQVMsQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDdkQsQ0FBQztJQUdELFFBQVEsQ0FBQyxNQUFvRDtRQUN6RCxvQ0FBb0M7UUFDcEMsY0FBYztRQUNkLDJCQUEyQjtRQUMzQixzQkFBc0I7UUFDdEIsYUFBYTtRQUNiLGFBQWE7UUFDYixlQUFlO1FBQ2YsVUFBVTtRQUNaLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDO1FBQzFCLFFBQWMsTUFBTyxDQUFDLE9BQU8sRUFBRTtZQUM3QixLQUFLLENBQUM7Z0JBQ0osTUFBTSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7Z0JBQ25CLE1BQU07WUFDTixLQUFLLENBQUM7Z0JBQ0osTUFBTSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7Z0JBQ25CLE1BQU07WUFDTjtnQkFDRSxNQUFNO1NBQ1Q7UUFDRCxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxrQkFBSSxJQUFJLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLFFBQVEsSUFBSyxNQUFNLEVBQUcsQ0FBQztJQUMvRixDQUFDO0NBQ0Y7QUFoQ0QsMEJBZ0NDIn0=