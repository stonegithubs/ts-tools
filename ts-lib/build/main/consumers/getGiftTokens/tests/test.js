"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getGiftTokens_1 = __importDefault(require("../getGiftTokens"));
const puppeteer_1 = __importDefault(require("puppeteer"));
const utils_1 = require("../../../lib/utils");
let count = 0;
(async () => {
    const browser = await puppeteer_1.default.launch({
        headless: false
    });
    let page = await browser.newPage();
    do {
        let result;
        await page.setViewport({
            width: 1920,
            height: 1000
        });
        try {
            await getGiftTokens_1.default(page);
        }
        catch (error) {
            utils_1.log('循环错误！', error);
            if (!page.isClosed()) {
                await page.close();
            }
            page = await browser.newPage();
        }
    } while (await page.waitFor(1500) || true);
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9jb25zdW1lcnMvZ2V0R2lmdFRva2Vucy90ZXN0cy90ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEscUVBQXlDO0FBQ3pDLDBEQUFrQztBQUNsQyw4Q0FBeUM7QUFFekMsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO0FBQ2QsQ0FBQyxLQUFLLElBQUksRUFBRTtJQUNSLE1BQU0sT0FBTyxHQUFHLE1BQU0sbUJBQVMsQ0FBQyxNQUFNLENBQUM7UUFDbkMsUUFBUSxFQUFFLEtBQUs7S0FDaEIsQ0FBQyxDQUFDO0lBQ0gsSUFBSSxJQUFJLEdBQUcsTUFBTSxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDbkMsR0FBRztRQUNDLElBQUksTUFBTSxDQUFDO1FBQ1gsTUFBTSxJQUFJLENBQUMsV0FBVyxDQUFDO1lBQ25CLEtBQUssRUFBRSxJQUFJO1lBQ1gsTUFBTSxFQUFFLElBQUk7U0FDZixDQUFDLENBQUE7UUFDRixJQUFJO1lBQ0YsTUFBTSx1QkFBUyxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ3ZCO1FBQUMsT0FBTyxLQUFLLEVBQUU7WUFDWixXQUFHLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ3BCLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLEVBQUU7Z0JBQ3BCLE1BQU0sSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO2FBQ3BCO1lBQ0QsSUFBSSxHQUFHLE1BQU0sT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO1NBQ2xDO0tBQ0osUUFBUSxNQUFNLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxFQUFFO0FBQ2pELENBQUMsQ0FBQyxFQUFFLENBQUEifQ==