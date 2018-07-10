"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
let smtpConfig = {
    host: '127.0.0.1',
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYi9tYWlsL2NsaWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDREQUFvQztBQUVwQyxJQUFJLFVBQVUsR0FBRztJQUNmLElBQUksRUFBRSxXQUFXO0lBQ2pCLElBQUksRUFBRSxFQUFFO0lBQ1IsTUFBTSxFQUFFLEtBQUs7Q0FDZCxDQUFDO0FBRUYsSUFBSSxXQUFXLEdBQUcsb0JBQVUsQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLENBQUE7QUFDeEQsSUFBSSxPQUFPLEdBQUc7SUFDWixJQUFJLEVBQUUsbUJBQW1CO0lBQ3pCLEVBQUUsRUFBRSxrQkFBa0I7SUFDdEIsT0FBTyxFQUFFLGVBQWU7SUFDeEIsSUFBSSxFQUFFLGtDQUFrQztJQUN4QyxJQUFJLEVBQUUsb0NBQW9DO0NBQzNDLENBQUM7QUFDRixXQUFXLENBQUMsUUFBUSxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsRUFBRTtJQUNqQyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ2xCLENBQUMsQ0FBQyxDQUFBIn0=