"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_1 = __importDefault(require("puppeteer"));
const puppeteer_utils_1 = require("../../../lib/utils/puppeteer-utils");
let count = 0;
let phone = '17782369765';
let pwd = 'Chosan179817004*';
(async () => {
    const browser = await puppeteer_1.default.launch({
        headless: false,
        args: ['--no-sandbox', '--proxy-server=socks5://127.0.0.1:1080']
    });
    const page = await browser.newPage();
    const myWaitAndClick = puppeteer_utils_1.waitAndClick.bind(null, page);
    await page.setViewport({
        width: 1190,
        height: 1000,
        devtools: true
    });
    await page.goto('http://dgctt.cn');
    await page.waitFor(20000);
    await myWaitAndClick('button#yes_sure');
    await myWaitAndClick('a.login-now');
    await myWaitAndClick('#login_moble');
    await page.type('#login_moble', phone);
    await myWaitAndClick('#login_password');
    await page.type('#login_password', pwd);
    let el = await page.$('#login_verify_up');
    await el.screenshot({ path: `./verify_up_${phone}.png` });
    //   do {
    //   } while (++count < 100);
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvcmVHaWZ0MlBsYXRmb3JtLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2NvbnN1bWVycy9nZXRHaWZ0VG9rZW5zL3Rlc3RzL3N0b3JlR2lmdDJQbGF0Zm9ybS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDBEQUFrQztBQUNsQyx3RUFBa0U7QUFFbEUsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO0FBQ2QsSUFBSSxLQUFLLEdBQUcsYUFBYSxDQUFDO0FBQzFCLElBQUksR0FBRyxHQUFHLGtCQUFrQixDQUFDO0FBQzdCLENBQUMsS0FBSyxJQUFJLEVBQUU7SUFDUixNQUFNLE9BQU8sR0FBRyxNQUFNLG1CQUFTLENBQUMsTUFBTSxDQUFDO1FBQ25DLFFBQVEsRUFBRSxLQUFLO1FBQ2YsSUFBSSxFQUFDLENBQUMsY0FBYyxFQUFDLHdDQUF3QyxDQUFDO0tBQ2pFLENBQUMsQ0FBQztJQUNILE1BQU0sSUFBSSxHQUFHLE1BQU0sT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ3JDLE1BQU0sY0FBYyxHQUFHLDhCQUFZLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNyRCxNQUFNLElBQUksQ0FBQyxXQUFXLENBQUM7UUFDbkIsS0FBSyxFQUFFLElBQUk7UUFDWCxNQUFNLEVBQUUsSUFBSTtRQUNaLFFBQVEsRUFBRSxJQUFJO0tBQ2pCLENBQUMsQ0FBQTtJQUNGLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0lBQ25DLE1BQU0sSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMxQixNQUFNLGNBQWMsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0lBQ3hDLE1BQU0sY0FBYyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0lBQ3BDLE1BQU0sY0FBYyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBQ3JDLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDdkMsTUFBTSxjQUFjLENBQUMsaUJBQWlCLENBQUMsQ0FBQztJQUN4QyxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDeEMsSUFBSSxFQUFFLEdBQUcsTUFBTSxJQUFJLENBQUMsQ0FBQyxDQUFDLGtCQUFrQixDQUFDLENBQUM7SUFDMUMsTUFBTSxFQUFFLENBQUMsVUFBVSxDQUFDLEVBQUUsSUFBSSxFQUFFLGVBQWUsS0FBSyxNQUFNLEVBQUUsQ0FBQyxDQUFDO0lBQzFELFNBQVM7SUFDVCw2QkFBNkI7QUFDakMsQ0FBQyxDQUFDLEVBQUUsQ0FBQSJ9