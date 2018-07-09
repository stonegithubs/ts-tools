"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const colors_1 = __importDefault(require("colors"));
const crypto_1 = __importDefault(require("crypto"));
const { random, floor, abs } = Math;
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
function wait(time, data) {
    return new Promise(res => setTimeout(res.bind({}, data), time));
}
exports.wait = wait;
function throwError(msg) {
    throw new Error(msg);
}
exports.throwError = throwError;
function check(fn, msg = '超时', msTimeout = 15000, interval = 300) {
    return new Promise((res, rej) => {
        let id = setInterval(() => {
            let result = fn();
            msTimeout -= interval;
            if (result) {
                clearInterval(id);
                res(result);
            }
            else if (msTimeout <= 0) {
                clearInterval(id);
                rej(msg);
            }
        }, interval);
    });
}
exports.check = check;
// 返回 [min, max)
function getRandom(max = 100, min = 0, integer) {
    let randNum = min + (max - min) * random();
    return integer ? floor(randNum) : randNum;
}
exports.getRandom = getRandom;
// 返回 [min, max)
function getRandomInt(max = 100, min = 0, length) {
    if (length) {
        let numbers = [];
        for (let i = 0; i < abs(length); i++) {
            numbers.push(getRandom(max, min, true));
        }
        return numbers;
    }
    return getRandom(max, min, true);
}
exports.getRandomInt = getRandomInt;
function getDefaultChars() {
    const len = parseInt('1111111', 2); // 127   ascii 范围
    let chars = '';
    for (let i = 1; i < len; i++) {
        chars += String.fromCharCode(i);
    }
    return [...chars.match(/[0-9a-zA-Z]+/g).join('')];
}
exports.getDefaultChars = getDefaultChars;
function getRandomStr(maxLen = 20, minLen = 1, chars = getDefaultChars()) {
    const len = getRandomInt(maxLen, minLen);
    let str = '';
    for (let i = 0; i < len; i++) {
        str += chars[getRandomInt(0, chars.length)];
    }
    return str;
}
exports.getRandomStr = getRandomStr;
function log(...rest) {
    let method = rest[rest.length - 1];
    method = console.hasOwnProperty(method) ? rest.pop() : 'log';
    rest = rest.map(el => {
        if (typeof el === 'string') {
            switch (method) {
                case 'log':
                    break;
                case 'warn':
                    return colors_1.default.red(el);
                case 'error':
                default:
                    break;
            }
        }
        return el;
    });
    console['log'].apply({}, [new Date().toLocaleString(), '\n', ...rest]);
}
exports.log = log;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL3V0aWxzL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsb0RBQTRCO0FBQzVCLG9EQUE0QjtBQUU1QixNQUFNLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUM7QUFFcEMsYUFBcUIsR0FBVyxFQUFFLFdBQWdCLEtBQUs7SUFDckQsT0FBTyxnQkFBTSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBQzFFLENBQUM7QUFGRCxrQkFFQztBQUVELHVCQUE4QixNQUFXLEVBQUUsRUFBRSxFQUFHO0lBQzlDLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDbkMsQ0FBQztBQUZELHNDQUVDO0FBRUQsaUJBQXdCLEdBQVE7SUFDOUIsSUFBSSxVQUFVLEdBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3RELE9BQU8sVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsVUFBVSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztBQUN4RCxDQUFDO0FBSEQsMEJBR0M7QUFFRCxjQUFxQixJQUFJLEVBQUUsSUFBSztJQUM5QixPQUFPLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDbEUsQ0FBQztBQUZELG9CQUVDO0FBRUQsb0JBQTJCLEdBQUc7SUFDNUIsTUFBTSxJQUFJLEtBQUss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