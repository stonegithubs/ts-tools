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
        headless: false
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9jb25zdW1lcnMvZ2V0R2lmdFRva2Vucy90ZXN0cy90ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEscUVBQXlDO0FBQ3pDLDBEQUFrQztBQUVsQyxJQUFJLEtBQUssR0FBRyxDQUFDLENBQUM7QUFDZCxDQUFDLEtBQUssSUFBSSxFQUFFO0lBQ1IsTUFBTSxPQUFPLEdBQUcsTUFBTSxtQkFBUyxDQUFDLE1BQU0sQ0FBQztRQUNuQyxRQUFRLEVBQUUsS0FBSztLQUNoQixDQUFDLENBQUM7SUFDSCxNQUFNLElBQUksR0FBRyxNQUFNLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUNyQyxNQUFNLElBQUksQ0FBQyxXQUFXLENBQUM7UUFDckIsS0FBSyxFQUFFLElBQUk7UUFDWCxNQUFNLEVBQUUsSUFBSTtRQUNaLFFBQVEsRUFBRSxJQUFJO0tBQ2YsQ0FBQyxDQUFBO0lBQ0YsR0FBRztRQUNDLE1BQU0sdUJBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUN6QixRQUFRLEVBQUUsS0FBSyxHQUFHLEdBQUcsRUFBRTtBQUM5QixDQUFDLENBQUMsRUFBRSxDQUFBIn0=