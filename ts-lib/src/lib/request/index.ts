import rq from 'request';
import { log, throwError } from '../utils';

export default class MyReq{
  static getData(uri: string, body: any = {}, method: string = 'GET', params: any = { json: true }): Promise<any> {
    const opt: object = {
      method, uri,
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1'
      },
      // proxy: 'http://chosan.cn:12345'
    }

    switch (method.toLowerCase()) {
      case 'get':
          params.qs = body;
          params.form = undefined;
        break;
        case 'patch':
        case 'post':
        case 'put':
        default:
          params.body = body;
          if (!params.json) {
            params.form = body;
          }
        break;
    }

    let result = new Promise((res, rej) => {
      rq({ ...opt, ...params }, (err, response, data) => {
        if (err) {
          rej(err);
        } else {
          res(data);
        }
      })
    })

    result.catch(error => {
      console.error(uri, body, method, params);
      console.error('Req#getJson 错误:\t', error.message);
      throw error;
    });

    return result;
  }
  static getJson(uri: string, body: any = {}, method: string = 'GET', params: any = { json: true }): Promise<any> {
    let result = MyReq.getData(uri, body, method, params);
    return result.then(data => {
        console.log(data);
        let jsonData;
        try {
          return typeof data === 'string' ? JSON.parse(data) : data;
        } catch (error) {
          log('Req#JSON解析错误！', error, 'error');
          throw error;
        }
      });
  }

  public readonly jar: object = rq.jar();  // 保存 cookie
  public data: any[] = [];

  constructor(protected readonly baseURL: string = '', protected conf: any = {}) {}

  async workFlow(uri: string, data: object = {}, method: string = 'GET', params: any = {}) : Promise<any> {
    let { conf, baseURL, jar } = this;
    const oParams = { ...conf, jar, ...params };
    try {
      let response = await MyReq[(oParams.json) ? 'getJson' : 'getData'](baseURL + uri, data, method, oParams);
      this.data.push(response);
      return response;
    } catch (error) {
      console.error('Req#workFlow 错误:\t', error.message);
      throw error;
    }
  }
  setProxy (proxy: string): void {
    this.conf.proxy = proxy;
  }
}