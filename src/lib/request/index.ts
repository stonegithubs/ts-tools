import rp from 'request-promise';

export default class MyReq{
  static getJson(uri: string, body: any = {}, method: string = 'GET', params: any = { json: true }): Promise<any> {
    const opt: object = {
      method, uri,
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1'
      },
      proxy: 'http://chosan.cn:12345'
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
          params.form = body;
        break;
    }

    return rp({ ...opt, ...params }).then(res =>{
      return res;
    }).catch(error => {
      console.log(uri, body, method, params);
      console.error('Req#getJson 错误:\t', error.message);
    });
  }
  public readonly jar: object = rp.jar();  // 保存 cookie
  public data: any[] = [];
  public proxy: string;

  constructor() {
    //
  }

  async workFlow(uri: string, data: object = {}, method: string = 'GET', params: any = {}) : Promise<any> {
    let { jar, proxy } = this;
    const oParams = { ...params, jar, proxy };
    try {
      let response = await MyReq.getJson(uri, data, method, oParams);
      this.data.push(response);
    } catch (error) {
      console.error('Req#workFlow 错误:\t', error.message);
    }
    return this;
  }
  setProxy (proxy: string): void {
    this.proxy = proxy;
  }
}