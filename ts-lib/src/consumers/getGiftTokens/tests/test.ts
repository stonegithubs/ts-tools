import fnGetGift from '../getGiftTokens';
import puppeteer from 'puppeteer';
import { log } from '../../../lib/utils';

let count = 0;
(async () => {
    const browser = await puppeteer.launch({
        headless: false
      });
      let page = await browser.newPage();
      do {
          let result;
          await page.setViewport({
              width: 1920,
              height: 1000
          })
          try {
            await fnGetGift(page);
          } catch (error) {
              log('循环错误！', error);
              if (!page.isClosed()) {
                await page.close();
              }
              page = await browser.newPage();
          }
      } while (await page.waitFor(1500) || true);
})()