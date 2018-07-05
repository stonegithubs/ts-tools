import crypto from 'crypto';

const { random, floor } = Math;

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
export function getRandomInt(max = 100, min = 0): number {
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
    str += chars[getRandomInt(0, chars.length)]
  }
  return str;
}

export function log(...rest): void{
  let method = rest[rest.length - 1];
  method = console.hasOwnProperty(method) ? rest.pop() : 'log';
  console[method].apply({}, [ new Date().toLocaleString(), '\n', ...rest ]);
}