import { md5, getSortedKeys } from '../../lib/utils';

export default class Okex {
  constructor(private readonly api_key: string, private readonly secret_key: string){
    //
  }
  buildSign(params: any = {}): string {
    let { api_key, secret_key } = this;
    params = { ...params, api_key };
    let sign = '';
    for(let key of getSortedKeys(params)) {
      sign += `${key}=${params[key]}&`
    }
    sign += `secret_key=${secret_key}`;
    return md5(sign);
  }
}