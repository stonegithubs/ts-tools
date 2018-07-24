"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const { random, floor } = Math;
const mailList = ['@ysd.kim', '@mln.fun', '@mlo.fun', '@mln.kim', '@0-9.kim', '@mlo.static.kim', '@imin.kim', '@z-a.top'];
function gMail(suffix = mailList, allowChars) {
    suffix = Array.isArray(suffix) ? suffix[utils_1.getRandomInt(suffix.length)] : suffix;
    return utils_1.getRandomStr(15, 10, allowChars) + suffix;
}
exports.gMail = gMail;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL21haWwvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxvQ0FBdUU7QUFFdkUsTUFBTSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsR0FBRyxJQUFJLENBQUM7QUFDL0IsTUFBTSxRQUFRLEdBQUcsQ0FBQyxVQUFVLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLGlCQUFpQixFQUFFLFdBQVcsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUUxSCxlQUFzQixTQUE4QixRQUFRLEVBQUUsVUFBcUI7SUFDakYsTUFBTSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxvQkFBWSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7SUFDeEYsT0FBTyxvQkFBWSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsVUFBVSxDQUFDLEdBQUcsTUFBTSxDQUFDO0FBQ25ELENBQUM7QUFIRCxzQkFHQyJ9