import smtp from 'smtp-protocol';
import fs from 'fs';

smtp.connect('localhost', 9025, function (mail) {
    console.log(111);

    mail.helo('example.com');
    mail.from('substack@example.com');
    mail.to('179817004@qq.com');
    mail.data();
    fs.createReadStream('./server.js').pipe(mail.message((err, code, lines) => {
      console.log(err, code, lines);
    }));
    mail.quit();
});