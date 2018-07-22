import { equal } from 'assert';
import Redis from 'ioredis';
import { simpleParser } from 'mailparser';
import MailServer from '../server';

let redis = new Redis({
  host: 'chosan.cn',
  password: '199381'
});
let ms = new MailServer({
  secure: false,
  hideSTARTTLS: true,
  allowInsecureAuth: true,
  authOptional: true,
  onData(stream, session, cb): void {
    let tmp = session || cb;
    tmp += tmp;
    simpleParser(stream, (err, mail) => {
      cb();
      equal(err, null, '');
      redis.publish('mailReceived', JSON.stringify(mail));
    });
  }
});

ms.on('error', err => {
  console.log(err);
});

ms.listen(25);

// import { gMail } from '../utils';

// for(let i = 0; i < 100; i ++ ) {
//   console.log(gMail());
// }