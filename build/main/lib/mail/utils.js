"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const { random, floor } = Math;
function gMail(suffix = ['@ysd.kim', '@mln.fun', '@mlo.fun', '@mln.kim'], allowChars) {
    suffix = Array.isArray(suffix) ? suffix[utils_1.getRandomInt(suffix.length)] : suffix;
    return utils_1.getRandomStr(15, 10, allowChars) + suffix;
}
exports.gMail = gMail;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL21haWwvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxvQ0FBdUU7QUFFdkUsTUFBTSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsR0FBRyxJQUFJLENBQUM7QUFFL0IsZUFBc0IsU0FBOEIsQ0FBQyxVQUFVLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxVQUFVLENBQUMsRUFBRSxVQUFxQjtJQUN6SCxNQUFNLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLG9CQUFZLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQztJQUN4RixPQUFPLG9CQUFZLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxVQUFVLENBQUMsR0FBRyxNQUFNLENBQUM7QUFDbkQsQ0FBQztBQUhELHNCQUdDIn0=