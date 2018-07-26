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
    return new Promise(res => setTimeout(() => {
        res(typeof data === 'function' ? data() : data);
    }, time));
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
function randomArray(arr, isPop = false) {
    let index = getRandomInt(arr.length);
    if (isPop) {
        return arr.splice(index, 1);
    }
    else {
        return arr[index];
    }
}
exports.randomArray = randomArray;
function randomUA() {
    let UAList = [
        'Openwave/ UCWEB7.0.2.37/28/999',
        'Opera/9.80 (Macintosh; Intel Mac OS X 10.6.8; U; en) Presto/2.8.131 Version/11.11',
        'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)',
        'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1)',
        'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; 360SE)',
        'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Maxthon 2.0)',
        'Mozilla/4.0 (compatible; MSIE 6.0; ) Opera/UCWEB7.0.2.37/28/999',
        'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Avant Browser)',
        'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; TencentTraveler 4.0)',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.6; rv:2.0.1) Gecko/20100101 Firefox/4.0.1',
        'Mozilla/5.0 (compatible; MSIE 9.0; Windows Phone OS 7.5; Trident/5.0; IEMobile/9.0; HTC; Titan)',
        'Mozilla/5.0 (BlackBerry; U; BlackBerry 9800; en) AppleWebKit/534.1+ (KHTML, like Gecko) Version/6.0.0.337 Mobile Safari/534.1+',
        'Mozilla/5.0 (hp-tablet; Linux; hpwOS/3.0.0; U; en-US) AppleWebKit/534.6 (KHTML, like Gecko) wOSBrowser/233.70 Safari/534.6 TouchPad/1.0',
        'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Trident/4.0; SE 2.X MetaSr 1.0; SE 2.X MetaSr 1.0; .NET CLR 2.0.50727; SE 2.X MetaSr 1.0)',
        'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_3 like Mac OS X) AppleWebKit/603.3.8 (KHTML, like Gecko) Mobile/14G60 MicroMessenger/6.5.18 NetType/WIFI Language/en',
        'Mozilla/5.0 (SymbianOS/9.4; Series60/5.0 NokiaN97-1/20.0.019; Profile/MIDP-2.1 Configuration/CLDC-1.1) AppleWebKit/525 (KHTML, like Gecko) BrowserNG/7.1.18124',
        'Mozilla/5.0 (Linux; U; Android 7.0; zh-cn; STF-AL00 Build/HUAWEISTF-AL00) AppleWebKit/537.36 (KHTML, like Gecko)Version/4.0 Chrome/37.0.0.0 MQQBrowser/7.9 Mobile Safari/537.36',
        'Mozilla/5.0 (Linux; Android 4.4.4; SM-N935F Build/KTU84P) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/33.0.0.0 Safari/537.36 baidubrowser/7.13.13.0 (Baidu; P1 4.4.4)',
        'Mozilla/5.0 (Linux; U; Android 6.0.1; zh-CN; SM-C7000 Build/MMB29M) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/40.0.2214.89 UCBrowser/11.6.2.948 Mobile Safari/537.36',
        'Mozilla/5.0 (Linux; U; Android 7.1.2; zh-cn; MI 5X Build/N2G47H) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/53.0.2785.146 Mobile Safari/537.36 XiaoMi/MiuiBrowser/9.2.2',
        'Mozilla/5.0 (iPhone 84; CPU iPhone OS 10_3_3 like Mac OS X) AppleWebKit/603.3.8 (KHTML, like Gecko) Version/10.0 MQQBrowser/7.8.0 Mobile/14G60 Safari/8536.25 MttCustomUA/2 QBWebViewType/1 WKType/1',
        'Mozilla/5.0 (iPhone 84; CPU iPhone OS 10_3_3 like Mac OS X) AppleWebKit/603.3.8 (KHTML, like Gecko) Version/10.0 MQQBrowser/7.8.0 Mobile/14G60 Safari/8536.25 MttCustomUA/2 QBWebViewType/1 WKType/1',
        'Mozilla/5.0 (iPhone; CPU iPhone OS 9_2_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Mobile/13D15 search%2F1.0 baiduboxapp/0_0.1.1.7_enohpi_8022_2421/1.2.9_1C2%257enohPi/1099a/088D84D1E9A6AEE91798B97AAA03690B96CFCB638FGIMSINMHB/1',
        'Mozilla/5.0 (Linux; Android 7.0; STF-AL10 Build/HUAWEISTF-AL10; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/53.0.2785.49 Mobile MQQBrowser/6.2 TBS/043508 Safari/537.36 V1_AND_SQ_7.2.0_730_YYB_D QQ/7.2.0.3270 NetType/4G WebP/0.3.0 Pixel/1080',
        'Mozilla/5.0 (Linux; Android 7.0; FRD-AL00 Build/HUAWEIFRD-AL00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/53.0.2785.49 Mobile MQQBrowser/6.2 TBS/043508 Safari/537.36 V1_AND_SQ_7.1.0_0_TIM_D TIM2.0/1.2.0.1692 QQ/6.5.5 NetType/2G WebP/0.3.0 Pixel/1080 IMEI/869953022249635'
    ];
    return randomArray(UAList);
}
exports.randomUA = randomUA;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL3V0aWxzL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsb0RBQTRCO0FBQzVCLG9EQUE0QjtBQUM1Qiw2QkFBMkM7QUFFM0MsTUFBTSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDO0FBRXBDLGFBQXFCLEdBQVcsRUFBRSxXQUFnQixLQUFLO0lBQ3JELE9BQU8sZ0JBQU0sQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztBQUMxRSxDQUFDO0FBRkQsa0JBRUM7QUFFRCx1QkFBOEIsTUFBVyxFQUFFLEVBQUUsRUFBRztJQUM5QyxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ25DLENBQUM7QUFGRCxzQ0FFQztBQUVELGlCQUF3QixHQUFRO0lBQzlCLElBQUksVUFBVSxHQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN0RCxPQUFPLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDeEQsQ0FBQztBQUhELDBCQUdDO0FBRUQsY0FBcUIsSUFBSSxFQUFFLElBQUs7SUFDOUIsT0FBTyxJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUU7UUFDeEMsR0FBRyxDQUFDLE9BQU8sSUFBSSxLQUFLLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2xELENBQUMs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