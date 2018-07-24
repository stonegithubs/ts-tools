import { getDefaultChars, getRandomInt, getRandomStr } from "../utils";

const { random, floor } = Math;
const mailList = ['@ysd.kim', '@mln.fun', '@mlo.fun', '@mln.kim', '@0-9.kim', '@mlo.static.kim', '@imin.kim', '@z-a.top'];

export function gMail(suffix: (string | string[]) = mailList, allowChars?: string[]): string {
  suffix = Array.isArray(suffix) ? suffix[getRandomInt(suffix.length) as number] : suffix;
  return getRandomStr(15, 10, allowChars) + suffix;
}