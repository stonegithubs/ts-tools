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