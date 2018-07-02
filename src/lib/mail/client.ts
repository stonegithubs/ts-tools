import nodemailer from 'nodemailer';

let smtpConfig = {
  host: '127.0.0.1',
  port: 25,
  secure: false
};

let transporter = nodemailer.createTransport(smtpConfig)
let message = {
  from: 'sender@chosan.com',
  to: '179817004@qq.com',
  subject: 'Message title',
  text: 'Plaintext version of the message',
  html: '<p>HTML version of the message</p>'
};
transporter.sendMail(message, cb => {
  console.log(cb);
})
