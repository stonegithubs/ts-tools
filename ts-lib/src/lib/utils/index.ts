import colors from 'colors';
import crypto from 'crypto';
import { URL, URLSearchParams } from 'url';

const { random, floor, abs } = Math;

export function md5 (str: string, encoding: any = 'hex'): string {
  return crypto.createHash('md5').update(str).digest(encoding).toString();
}

export function getSortedKeys(obj: any = {}, fn?): string [] {
  return Object.keys(obj).sort(fn);
}

export function getType(obj: any): string {
  let originType =  Object.prototype.toString.call(obj);
  return originType.substring(8, originType.length - 1);
}

export function wait(time, data?): Promise<any> {
  return new Promise(res => setTimeout(res.bind({}, data), time));
}

export function throwError(msg): never {
  throw new Error(msg);
}

export function check(fn, msg = '超时', msTimeout = 15000, interval = 300): Promise<any> {
  return new Promise((res, rej) => {
    let id = setInterval(() => {
      let result = fn();
      msTimeout -= interval;
      if (result) {
        clearInterval(id);
        res(result);
      } else if (msTimeout <= 0){
        clearInterval(id);
        rej(msg);
      }
    }, interval);
  })
}

// 返回 [min, max)
export function getRandom(max = 100, min = 0, integer?): number {
  let randNum = min + (max - min) * random();
  return integer ? floor(randNum) : randNum;
}

// 返回 [min, max)
export function getRandomInt(max = 100, min = 0, length?: number): (number | number[]) {
  if (length) {
    let numbers = [];
    for(let i = 0; i < abs(length); i++) {
      numbers.push(getRandom(max, min, true));
    }
    return numbers;
  }
  return getRandom(max, min, true);
}

export function getDefaultChars(): string[] {
  const len = parseInt('1111111', 2); // 127   ascii 范围
  let chars = '';
  for (let i = 1; i < len; i++) {
    chars += String.fromCharCode(i);
  }
  return [ ...chars.match(/[0-9a-zA-Z]+/g).join('') ];
}

export function getRandomStr(maxLen: number = 20, minLen: number = 1, chars = getDefaultChars()): string {
  const len = getRandomInt(maxLen, minLen);
  let str = '';
  for (let i = 0; i < len; i++) {
    str += chars[getRandomInt(0, chars.length) as number]
  }
  return str;
}

export function log(...rest): void{
  let method = rest[rest.length - 1];
  method = console.hasOwnProperty(method) ? rest.pop() : 'log';
  rest = rest.map(el => {
    if (typeof el === 'string') {
      switch (method) {
        case 'log':
          break;
        case 'warn':
          return colors.red(el);
        case 'error':
        default:
          break;
      }
    }
    return el;
  })

  console['log'].apply({}, [ new Date().toLocaleString(), '\n', ...rest ]);
}

export function buildURL(uri = '', query = {}) {
  let uriInfo = uri.split('?');
  let search;
  if (uriInfo[1]) {
    search = `${new URLSearchParams(uriInfo[1])}&${new URLSearchParams(query)}`;
  } else {
    search = new URLSearchParams(query);
  }
  return `${uri}?${search}`;
}

export function until(cb) {

}


export function randomUA() {
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
  ]
  return UAList[getRandomInt(UAList.length) as number];
}