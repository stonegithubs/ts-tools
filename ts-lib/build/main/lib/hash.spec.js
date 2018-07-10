"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:no-expression-statement no-object-mutation
const ava_1 = require("ava");
const hash_1 = require("./hash");
const hash = (t, input, expected) => {
    t.is(hash_1.sha256(input), expected);
    t.is(hash_1.sha256Native(input), expected);
};
hash.title = (providedTitle, input, expected) => `${providedTitle}: ${input} => ${expected}`;
ava_1.test('sha256', hash, 'test', '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08');
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFzaC5zcGVjLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi9oYXNoLnNwZWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw0REFBNEQ7QUFDNUQsNkJBQWtDO0FBQ2xDLGlDQUE4QztBQUU5QyxNQUFNLElBQUksR0FBVSxDQUFDLENBQUMsRUFBRSxLQUFhLEVBQUUsUUFBZ0IsRUFBRSxFQUFFO0lBQ3pELENBQUMsQ0FBQyxFQUFFLENBQUMsYUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQzlCLENBQUMsQ0FBQyxFQUFFLENBQUMsbUJBQVksQ0FBQyxLQUFLLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztBQUN0QyxDQUFDLENBQUM7QUFFRixJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsYUFBcUIsRUFBRSxLQUFhLEVBQUUsUUFBZ0IsRUFBRSxFQUFFLENBQ3RFLEdBQUcsYUFBYSxLQUFLLEtBQUssT0FBTyxRQUFRLEVBQUUsQ0FBQztBQUU5QyxVQUFJLENBQ0YsUUFBUSxFQUNSLElBQUksRUFDSixNQUFNLEVBQ04sa0VBQWtFLENBQ25FLENBQUMifQ==