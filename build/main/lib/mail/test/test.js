"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("../server"));
// import fs from 'fs';
const mailparser2_1 = __importDefault(require("mailparser2"));
let ms = new server_1.default();
ms.on('to', (req, to, ack) => {
    console.log('to', req.from, to);
    ack.accept();
});
ms.on('message', (req, stream, ack) => {
    console.log(req.from + '\t' + req.to);
    let mailparser = new mailparser2_1.default.MailParser2;
    mailparser.on('end', data => {
        console.log(data);
    });
    stream.pipe(mailparser);
    ack.accept();
});
ms.listen(9025);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9saWIvbWFpbC90ZXN0L3Rlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSx1REFBbUM7QUFDbkMsdUJBQXVCO0FBQ3ZCLDhEQUFxQztBQUlyQyxJQUFJLEVBQUUsR0FBRyxJQUFJLGdCQUFVLEVBQUUsQ0FBQztBQUUxQixFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUU7SUFDekIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztJQUNoQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDakIsQ0FBQyxDQUFDLENBQUE7QUFHRixFQUFFLENBQUMsRUFBRSxDQUFDLFNBQVMsRUFBRSxDQUFDLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLEVBQUU7SUFDbEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLElBQUksR0FBRyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDdEMsSUFBSSxVQUFVLEdBQUcsSUFBSSxxQkFBVSxDQUFDLFdBQVcsQ0FBQztJQUM1QyxVQUFVLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsRUFBRTtRQUN4QixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3RCLENBQUMsQ0FBQyxDQUFBO0lBQ0YsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUN4QixHQUFHLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDakIsQ0FBQyxDQUFDLENBQUE7QUFFRixFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFBIn0=