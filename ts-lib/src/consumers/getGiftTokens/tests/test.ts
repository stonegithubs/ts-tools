import fnGetGift from '../getGiftTokens';
import puppeteer from 'puppeteer';

let count = 0;
(async () => {
    const browser = await puppeteer.launch({
        // headless: false
      });
      const page = await browser.newPage();
      await page.setViewport({
        width: 1190,
        height: 1000,
        devtools: true
      })
      do {
          await fnGetGift(page);
      } while (++count < 100);
})()