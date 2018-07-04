"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const { random, floor } = Math;
function gMail(suffix = ['@chosan.cn', '@ysd.kim', '@mln.fun', '@mlo.fun', '@mln.kim'], allowChars) {
    suffix = Array.isArray(suffix) ? suffix[utils_1.getRandomInt(suffix.length)] : suffix;
    return utils_1.getRandomStr(15, 5, allowChars) + suffix;
}
exports.gMail = gMail;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL21haWwvdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxvQ0FBdUU7QUFFdkUsTUFBTSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsR0FBRyxJQUFJLENBQUM7QUFFL0IsZUFBc0IsU0FBOEIsQ0FBQyxZQUFZLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsVUFBVSxDQUFDLEVBQUUsVUFBcUI7SUFDdkksTUFBTSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxvQkFBWSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7SUFDOUUsT0FBTyxvQkFBWSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsVUFBVSxDQUFDLEdBQUcsTUFBTSxDQUFDO0FBQ2xELENBQUM7QUFIRCxzQkFHQyJ9