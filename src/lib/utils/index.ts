import crypto from 'crypto';

export function md5 (str: string, encoding: any = 'hex'): string {
  return crypto.createHash('md5').update(str).digest(encoding).toString();
}