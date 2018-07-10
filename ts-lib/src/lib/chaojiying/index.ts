// import fs from 'fs';
// import FormData from 'form-data';
import request from 'request';
import XunDaili from '../proxy/xundaili';
import Req from '../request';
import Requester from '../utils/declarations/requester';

const xdl = new XunDaili({ orderno: 'ZF2018730302kdQRPU', secret: '944417ea359346e4ad882483cb63c13c' }); // ZF2018744533NVHTc0 ZF2018730302kdQRPU

export default class Chaojiying implements Requester{
  static readonly baseURL: string = 'http://upload.chaojiying.net';
  requester: Req = new Req(Chaojiying.baseURL);
  constructor(protected user: string, protected pass: string, protected softid?: string) {}
  validate(userfile: any, codetype: string, softId?: string): any {
    const { user, pass, softid = softId } = this;
    return new Promise((res, rej) => {
      const rq = request.post(Chaojiying.baseURL + '/Upload/Processing.php', (err, httpResponse, body): void => {
        if (!err && httpResponse.statusCode === 200) {
          res(typeof body === 'string' ? JSON.parse(body) : body);
        } else {
          rej(err || httpResponse.statusMessage);
        }
      })
      const form = rq.form();
      form.append('user', user);
      form.append('pass', pass);
      form.append('softid', softid);
      form.append('codetype', codetype);
      form.append('userfile', userfile);
    })
  }
  getScore(): Promise<any> {
    const { user, pass, requester } = this;
    return requester.workFlow('/Upload/GetScore.php', { user, pass }, 'post');
  }
  async reportError(id, softId?): Promise<any> {
    const { user, pass, softid = softId, requester } = this;
    return requester.workFlow('/Upload/ReportError.php', { user, pass, softid, id }, 'post');
  }
}