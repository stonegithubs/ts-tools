"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_1 = __importDefault(require("../../request"));
class autoProxy {
    constructor() {
        this.requester = new request_1.default();
    }
}
autoProxy.cursor = 0;
autoProxy.proxyList = [];
exports.default = autoProxy;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0b1Byb3h5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2xpYi9wcm94eS9hdXRvUHJveHkvYXV0b1Byb3h5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsNERBQWtDO0FBR2xDO0lBQUE7UUFHRSxjQUFTLEdBQUcsSUFBSSxpQkFBSyxFQUFFLENBQUM7SUFFMUIsQ0FBQzs7QUFKUSxnQkFBTSxHQUFHLENBQUMsQ0FBQztBQUNYLG1CQUFTLEdBQUcsRUFBRSxDQUFDO0FBRnhCLDRCQUtDIn0=