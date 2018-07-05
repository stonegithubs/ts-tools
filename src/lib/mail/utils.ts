import { getDefaultChars, getRandomInt, getRandomStr } from "../utils";

const { random, floor } = Math;

export function gMail(suffix: (string | string[]) = ['@ysd.kim', '@mln.fun', '@mlo.fun', '@mln.kim'], allowChars?: string[]): string {
  suffix = Array.isArray(suffix) ? suffix[getRandomInt(suffix.length)] : suffix;
  return getRandomStr(15, 10, allowChars) + suffix;
}