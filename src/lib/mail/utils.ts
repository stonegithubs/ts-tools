const { random, floor } = Math;


function getDefaultChars(): string[] {
  let chars = '';
  let len = 128;
  for (let i = 1; i < len; i++) {
    chars += String.fromCharCode(i);
  }
  return [ ...chars.match(/[0-9a-zA-Z]+/g).join('') ];
}

export function gMail(suffix = '@chosan.cn', allowChars = getDefaultChars()): string {
  let len = random() * 10 + 5;
  let charsLen = allowChars.length;
  let strMail = '';
  for (let i = 0; i < len; i++) {
    strMail += allowChars[floor(random() * charsLen) + 1];
  }
  return strMail + suffix;
}