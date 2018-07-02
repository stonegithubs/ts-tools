import Req from '../request';

export default class Chaojiying{
  static host: string = 'http://upload.chaojiying.net/';

  constructor(protected user: string, protected pass: string) {}
  validate(userfile: any, codetype: string, softid: number = 896776): Promise<any> {
    const { user, pass } = this;
    return Req.getJson(Chaojiying.host + 'Upload/Processing.php', { user, pass, softid, codetype }, 'post', { formData: { userfile } });
  }
  getScore(): Promise<any> {
    const { user, pass } = this;
    return Req.getJson(Chaojiying.host + 'Upload/GetScore.php', { user, pass }, 'post');
  }
}