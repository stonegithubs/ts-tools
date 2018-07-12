"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const colors_1 = __importDefault(require("colors"));
const crypto_1 = __importDefault(require("crypto"));
const url_1 = require("url");
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
function buildURL(uri = '', query = {}) {
    let uriInfo = uri.split('?');
    let search;
    if (uriInfo[1]) {
        search = `${new url_1.URLSearchParams(uriInfo[1])}&${new url_1.URLSearchParams(query)}`;
    }
    else {
        search = new url_1.URLSearchParams(query);
    }
    return `${uri}?${search}`;
}
exports.buildURL = buildURL;
function until(cb) {
}
exports.until = until;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL3V0aWxzL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsb0RBQTRCO0FBQzVCLG9EQUE0QjtBQUM1Qiw2QkFBMkM7QUFFM0MsTUFBTSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDO0FBRXBDLGFBQXFCLEdBQVcsRUFBRSxXQUFnQixLQUFLO0lBQ3JELE9BQU8sZ0JBQU0sQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztBQUMxRSxDQUFDO0FBRkQsa0JBRUM7QUFFRCx1QkFBOEIsTUFBVyxFQUFFLEVBQUUsRUFBRztJQUM5QyxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ25DLENBQUM7QUFGRCxzQ0FFQztBQUVELGlCQUF3QixHQUFRO0lBQzlCLElBQUksVUFBVSxHQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN0RCxPQUFPLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDeEQsQ0FBQztBQUhELDBCQUdDO0FBRUQsY0FBcUIsSUFBSSxFQUFFLElBQUs7SUFDOUIsT0FBTyxJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQ2xFLENBQUM7QUFGRCxvQkFFQztBQUVELG9CQUEyQixHQUFHO0lBQzVCLE1BQU0sSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDdkIsQ0FBQztBQUZELGdDQUVDO0FBRUQsZUFBc0IsRUFBRSxFQUFFLEdBQUcsR0FBRyxJQUFJLEVBQUUsU0FBUyxHQUFHLEtBQUssRUFBRSxRQUFRLEdBQUcsR0FBRztJQUNyRSxPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFO1FBQzlCLElBQUksRUFBRSxHQUFHLFdBQVcsQ0FBQyxHQUFHLEVBQUU7WUFDeEIsSUFBSSxNQUFNLEdBQUcsRUFBRSxFQUFFLENBQUM7WUFDbEIsU0FBUyxJQUFJLFFBQVEsQ0FBQztZQUN0QixJQUFJLE1BQU0sRUFBRTtnQkFDVixhQUFhLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQ2xCLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQzthQUNiO2lCQUFNLElBQUksU0FBUyxJQUFJLENBQUMsRUFBQztnQkFDeEIsYUFBYSxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUNsQixHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDVjtRQUNILENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUNmLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQztBQWRELHNCQWNDO0FBRUQsZ0JBQWdCO0FBQ2hCLG1CQUEwQixHQUFHLEdBQUcsR0FBRyxFQUFFLEdBQUcsR0FBRyxDQUFDLEVBQUUsT0FBUTtJQUNwRCxJQUFJLE9BQU8sR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsTUFBTSxFQUFFLENBQUM7SUFDM0MsT0FBTyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO0FBQzVDLENBQUM7QUFIRCw4QkFHQztBQUVELGdCQUFnQjtBQUNoQixzQkFBNkIsR0FBRyxHQUFHLEdBQUcsRUFBRSxHQUFHLEdBQUcsQ0FBQyxFQUFFLE1BQWU7SUFDOUQsSUFBSSxNQUFNLEVBQUU7UUFDVixJQUFJLE9BQU8sR0FBRyxFQUFFLENBQUM7UUFDakIsS0FBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUNuQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7U0FDekM7UUFDRCxPQUFPLE9BQU8sQ0FBQztLQUNoQjtJQUNELE9BQU8sU0FBUyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDbkMsQ0FBQztBQVRELG9DQVNDO0FBRUQ7SUFDRSxNQUFNLEdBQUcsR0FBRyxRQUFRLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCO0lBQ3JELElBQUksS0FBSyxHQUFHLEVBQUUsQ0FBQztJQUNmLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDNUIsS0FBSyxJQUFJLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDakM7SUFDRCxPQUFPLENBQUUsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBRSxDQUFDO0FBQ3RELENBQUM7QUFQRCwwQ0FPQztBQUVELHNCQUE2QixTQUFpQixFQUFFLEVBQUUsU0FBaUIsQ0FBQyxFQUFFLEtBQUssR0FBRyxlQUFlLEVBQUU7SUFDN0YsTUFBTSxHQUFHLEdBQUcsWUFBWSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztJQUN6QyxJQUFJLEdBQUcsR0FBRyxFQUFFLENBQUM7SUFDYixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQzVCLEdBQUcsSUFBSSxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFXLENBQUMsQ0FBQTtLQUN0RDtJQUNELE9BQU8sR0FBRyxDQUFDO0FBQ2IsQ0FBQztBQVBELG9DQU9DO0FBRUQsYUFBb0IsR0FBRyxJQUFJO0lBQ3pCLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ25DLE1BQU0sR0FBRyxPQUFPLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztJQUM3RCxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRTtRQUNuQixJQUFJLE9BQU8sRUFBRSxLQUFLLFFBQVEsRUFBRTtZQUMxQixRQUFRLE1BQU0sRUFBRTtnQkFDZCxLQUFLLEtBQUs7b0JBQ1IsTUFBTTtnQkFDUixLQUFLLE1BQU07b0JBQ1QsT0FBTyxnQkFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDeEIsS0FBSyxPQUFPLENBQUM7Z0JBQ2I7b0JBQ0UsTUFBTTthQUNUO1NBQ0Y7UUFDRCxPQUFPLEVBQUUsQ0FBQztJQUNaLENBQUMsQ0FBQyxDQUFBO0lBRUYsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUUsQ0FBRSxJQUFJLElBQUksRUFBRSxDQUFDLGNBQWMsRUFBRSxFQUFFLElBQUksRUFBRSxHQUFHLElBQUksQ0FBRSxDQUFDLENBQUM7QUFDM0UsQ0FBQztBQW5CRCxrQkFtQkM7QUFFRCxrQkFBeUIsR0FBRyxHQUFHLEVBQUUsRUFBRSxLQUFLLEdBQUcsRUFBRTtJQUMzQyxJQUFJLE9BQU8sR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzdCLElBQUksTUFBTSxDQUFDO0lBQ1gsSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUU7UUFDZCxNQUFNLEdBQUcsR0FBRyxJQUFJLHFCQUFlLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxxQkFBZSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUM7S0FDN0U7U0FBTTtRQUNMLE1BQU0sR0FBRyxJQUFJLHFCQUFlLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDckM7SUFDRCxPQUFPLEdBQUcsR0FBRyxJQUFJLE1BQU0sRUFBRSxDQUFDO0FBQzVCLENBQUM7QUFURCw0QkFTQztBQUVELGVBQXNCLEVBQUU7QUFFeEIsQ0FBQztBQUZELHNCQUVDIn0=