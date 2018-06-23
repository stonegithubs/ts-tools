"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../lib/utils");
class Okex {
    constructor(api_key, secret_key) {
        this.api_key = api_key;
        this.secret_key = secret_key;
        //
    }
    buildSign(params = {}) {
        let { api_key, secret_key } = this;
        params = Object.assign({}, params, { api_key });
        let sign = '';
        for (let key of utils_1.getSortedKeys(params)) {
            sign += `${key}=${params[key]}&`;
        }
        sign += `secret_key=${secret_key}`;
        return utils_1.md5(sign);
    }
}
exports.default = Okex;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2tleC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb25zdW1lcnMvb2tleC9va2V4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsMkNBQXFEO0FBRXJEO0lBQ0UsWUFBNkIsT0FBZSxFQUFtQixVQUFrQjtRQUFwRCxZQUFPLEdBQVAsT0FBTyxDQUFRO1FBQW1CLGVBQVUsR0FBVixVQUFVLENBQVE7UUFDL0UsRUFBRTtJQUNKLENBQUM7SUFDRCxTQUFTLENBQUMsU0FBYyxFQUFFO1FBQ3hCLElBQUksRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLEdBQUcsSUFBSSxDQUFDO1FBQ25DLE1BQU0scUJBQVEsTUFBTSxJQUFFLE9BQU8sR0FBRSxDQUFDO1FBQ2hDLElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUNkLEtBQUksSUFBSSxHQUFHLElBQUkscUJBQWEsQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUNwQyxJQUFJLElBQUksR0FBRyxHQUFHLElBQUksTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUE7U0FDakM7UUFDRCxJQUFJLElBQUksY0FBYyxVQUFVLEVBQUUsQ0FBQztRQUNuQyxPQUFPLFdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNuQixDQUFDO0NBQ0Y7QUFkRCx1QkFjQyJ9