"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:no-expression-statement
const ava_1 = require("ava");
const async_1 = require("./async");
ava_1.test('getABC', async (t) => {
    t.deepEqual(await async_1.asyncABC(), ['a', 'b', 'c']);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXN5bmMuc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvYXN5bmMuc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHlDQUF5QztBQUN6Qyw2QkFBMkI7QUFDM0IsbUNBQW1DO0FBRW5DLFVBQUksQ0FBQyxRQUFRLEVBQUUsS0FBSyxFQUFDLENBQUMsRUFBQyxFQUFFO0lBQ3ZCLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxnQkFBUSxFQUFFLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDakQsQ0FBQyxDQUFDLENBQUMifQ==