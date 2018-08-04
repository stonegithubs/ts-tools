"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getGiftTokens_1 = __importDefault(require("../getGiftTokens"));
const puppeteer_1 = __importDefault(require("puppeteer"));
let count = 0;
(async () => {
    const browser = await puppeteer_1.default.launch({
    // headless: false
    });
    const page = await browser.newPage();
    await page.setViewport({
        width: 1190,
        height: 1000,
        devtools: true
    });
    do {
        await getGiftTokens_1.default(page);
    } while (++count < 100);
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9jb25zdW1lcnMvZ2V0R2lmdFRva2Vucy90ZXN0cy90ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEscUVBQXlDO0FBQ3pDLDBEQUFrQztBQUVsQyxJQUFJLEtBQUssR0FBRyxDQUFDLENBQUM7QUFDZCxDQUFDLEtBQUssSUFBSSxFQUFFO0lBQ1IsTUFBTSxPQUFPLEdBQUcsTUFBTSxtQkFBUyxDQUFDLE1BQU0sQ0FBQztJQUNuQyxrQkFBa0I7S0FDbkIsQ0FBQyxDQUFDO0lBQ0gsTUFBTSxJQUFJLEdBQUcsTUFBTSxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDckMsTUFBTSxJQUFJLENBQUMsV0FBVyxDQUFDO1FBQ3JCLEtBQUssRUFBRSxJQUFJO1FBQ1gsTUFBTSxFQUFFLElBQUk7UUFDWixRQUFRLEVBQUUsSUFBSTtLQUNmLENBQUMsQ0FBQTtJQUNGLEdBQUc7UUFDQyxNQUFNLHVCQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDekIsUUFBUSxFQUFFLEtBQUssR0FBRyxHQUFHLEVBQUU7QUFDOUIsQ0FBQyxDQUFDLEVBQUUsQ0FBQSJ9