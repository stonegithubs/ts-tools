import MailServer from '../server';
// import fs from 'fs';
import MailParser from 'mailparser2';



let ms = new MailServer();

ms.on('to', (req, to, ack) => {
    console.log('to', req.from, to);
    ack.accept();
})


ms.on('message', (req, stream, ack) => {
    console.log(req.from + '\t' + req.to);
    let mailparser = new MailParser.MailParser2;
    mailparser.on('end', data => {
        console.log(data);
    })
    stream.pipe(mailparser);
    ack.accept();
})

ms.listen(9025)