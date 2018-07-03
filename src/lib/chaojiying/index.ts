// import fs from 'fs';
// import FormData from 'form-data';
import request from 'request';
import Req from '../request';

export default class Chaojiying{
  static host: string = 'http://upload.chaojiying.net';

  constructor(protected user: string, protected pass: string, protected softid?: string) {}
  validate(userfile: any, codetype: string, softId?: string): any {
    const { user, pass, softid = softId } = this;
    return new Promise((res, rej) => {
      const rq = request.post(Chaojiying.host + '/Upload/Processing.php', (err, httpResponse, body): void => {
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
    const { user, pass } = this;
    return Req.getJson(Chaojiying.host + '/Upload/GetScore.php', { user, pass }, 'post');
  }
}