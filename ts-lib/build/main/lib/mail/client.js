"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
let smtpConfig = {
    host: 'mln.kim',
    port: 25,
    secure: false
};
let transporter = nodemailer_1.default.createTransport(smtpConfig);
let message = {
    from: 'sender@chosan.com',
    to: '179817004@qq.com',
    subject: 'Message title',
    text: 'Plaintext version of the message',
    html: '<p>HTML version of the message</p>'
};
transporter.sendMail(message, cb => {
    console.log(cb);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYi9tYWlsL2NsaWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDREQUFvQztBQUVwQyxJQUFJLFVBQVUsR0FBRztJQUNmLElBQUksRUFBRSxTQUFTO0lBQ2YsSUFBSSxFQUFFLEVBQUU7SUFDUixNQUFNLEVBQUUsS0FBSztDQUNkLENBQUM7QUFFRixJQUFJLFdBQVcsR0FBRyxvQkFBVSxDQUFDLGVBQWUsQ0FBQyxVQUFVLENBQUMsQ0FBQTtBQUN4RCxJQUFJLE9BQU8sR0FBRztJQUNaLElBQUksRUFBRSxtQkFBbUI7SUFDekIsRUFBRSxFQUFFLGtCQUFrQjtJQUN0QixPQUFPLEVBQUUsZUFBZTtJQUN4QixJQUFJLEVBQUUsa0NBQWtDO0lBQ3hDLElBQUksRUFBRSxvQ0FBb0M7Q0FDM0MsQ0FBQztBQUNGLFdBQVcsQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxFQUFFO0lBQ2pDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDbEIsQ0FBQyxDQUFDLENBQUEifQ==