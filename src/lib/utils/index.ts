import crypto from 'crypto';

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

export function wait(time): Promise<any> {
  return new Promise(res => setTimeout(res, time));
}

export function check(fn, msg = '超时', msTimeout = 15000, interval = 300): Promise<any> {
  return new Promise((res, rej) => {
    let id = setInterval(() => {
      let result = fn();
      msTimeout -= interval;
      if (result) {
        res(result);
        clearInterval(id);
      } else if (msTimeout <= 0){
        rej(msg);
        clearInterval(id);
      }
    }, interval);
  })
}