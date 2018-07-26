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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL3V0aWxzL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsb0RBQTRCO0FBQzVCLG9EQUE0QjtBQUM1Qiw2QkFBMkM7QUFFM0MsTUFBTSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDO0FBRXBDLGFBQXFCLEdBQVcsRUFBRSxXQUFnQixLQUFLO0lBQ3JELE9BQU8sZ0JBQU0sQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztBQUMxRSxDQUFDO0FBRkQsa0JBRUM7QUFFRCx1QkFBOEIsTUFBVyxFQUFFLEVBQUUsRUFBRztJQUM5QyxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ25DLENBQUM7QUFGRCxzQ0FFQztBQUVELGlCQUF3QixHQUFRO0lBQzlCLElBQUksVUFBVSxHQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN0RCxPQUFPLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDeEQsQ0FBQztBQUhELDBCQUdDO0FBRUQsY0FBcUIsSUFBSSxFQUFFLElBQUs7SUFDOUIsT0FBTyxJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQ2xFLENBQUM7QUFGRCxvQkFFQztBQUVELG9CQUEyQixHQUFHO0lBQzVCLE1B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