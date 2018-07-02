"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
function md5(str, encoding = 'hex') {
    return crypto_1.default.createHash('md5').update(str).digest(encoding).toString();
}
exports.md5 = md5;
function getSortedKeys(obj = {}, fn) {
    return Object.keys(obj).sort(fn);
}
exports.getSortedKeys = getSortedKeys;
function getType(obj) {
    let originType = Object.prototype.toString.call(obj);
    return originType.substring(8, originType.length - 1);
}
exports.getType = getType;
function wait(time) {
    return new Promise(res => setTimeout(res, time));
}
exports.wait = wait;
function check(fn, msg = '超时', msTimeout = 15000, interval = 300) {
    return new Promise((res, rej) => {
        let id = setInterval(() => {
            let result = fn();
            msTimeout -= interval;
            if (result) {
                res(result);
                clearInterval(id);
            }
            else if (msTimeout <= 0) {
                rej(msg);
                clearInterval(id);
            }
        }, interval);
    });
}
exports.check = check;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL3V0aWxzL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsb0RBQTRCO0FBRTVCLGFBQXFCLEdBQVcsRUFBRSxXQUFnQixLQUFLO0lBQ3JELE9BQU8sZ0JBQU0sQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztBQUMxRSxDQUFDO0FBRkQsa0JBRUM7QUFFRCx1QkFBOEIsTUFBVyxFQUFFLEVBQUUsRUFBRztJQUM5QyxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ25DLENBQUM7QUFGRCxzQ0FFQztBQUVELGlCQUF3QixHQUFRO0lBQzlCLElBQUksVUFBVSxHQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN0RCxPQUFPLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDeEQsQ0FBQztBQUhELDBCQUdDO0FBRUQsY0FBcUIsSUFBSTtJQUN2QixPQUFPLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQ25ELENBQUM7QUFGRCxvQkFFQztBQUVELGVBQXNCLEVBQUUsRUFBRSxHQUFHLEdBQUcsSUFBSSxFQUFFLFNBQVMsR0FBRyxLQUFLLEVBQUUsUUFBUSxHQUFHLEdBQUc7SUFDckUsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRTtRQUM5QixJQUFJLEVBQUUsR0FBRyxXQUFXLENBQUMsR0FBRyxFQUFFO1lBQ3hCLElBQUksTUFBTSxHQUFHLEVBQUUsRUFBRSxDQUFDO1lBQ2xCLFNBQVMsSUFBSSxRQUFRLENBQUM7WUFDdEIsSUFBSSxNQUFNLEVBQUU7Z0JBQ1YsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUNaLGFBQWEsQ0FBQyxFQUFFLENBQUMsQ0FBQzthQUNuQjtpQkFBTSxJQUFJLFNBQVMsSUFBSSxDQUFDLEVBQUM7Z0JBQ3hCLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDVCxhQUFhLENBQUMsRUFBRSxDQUFDLENBQUM7YUFDbkI7UUFDSCxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDZixDQUFDLENBQUMsQ0FBQTtBQUNKLENBQUM7QUFkRCxzQkFjQyJ9