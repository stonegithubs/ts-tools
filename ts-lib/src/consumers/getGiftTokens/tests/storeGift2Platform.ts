import puppeteer from 'puppeteer';
import { waitAndClick } from '../../../lib/utils/puppeteer-utils';

let count = 0;
let phone = '17782369765';
let pwd = 'Chosan179817004*';
(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        args:['--no-sandbox','--proxy-server=socks5://127.0.0.1:1080']
    });
    const page = await browser.newPage();
    const myWaitAndClick = waitAndClick.bind(null, page);
    await page.setViewport({
        width: 1190,
        height: 1000,
        devtools: true
    })
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
})()