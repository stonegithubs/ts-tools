import Req from '../request';

export default class Chaojiying{
  static host: string = 'http://upload.chaojiying.net/';

  constructor(protected user: string, protected pass: string, protected softid?: string) {}
  validate(userfile: any, codetype: string, softId?: string): Promise<any> {
    const { user, pass, softid = softId } = this;
    return Req.getJson(Chaojiying.host + 'Upload/Processing.php',{ user, pass, softid, codetype, userfile }, 'post');
  }
  getScore(): Promise<any> {
    const { user, pass } = this;
    return Req.getJson(Chaojiying.host + 'Upload/GetScore.php', { user, pass }, 'post');
  }
}