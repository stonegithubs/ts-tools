import MongoClientManager from '../../lib/mongo';
import { log } from '../../lib/utils';
import { waitAndClick } from '../../lib/utils/puppeteer-utils';

let mongo = new MongoClientManager();

export default async (page, username='zhangjianjun', password = 'Zhang199381*') => {
  await page.goto('https://www.myetherwallet.com/#generate-wallet', {timeout: 1000 * 90});
  let myWaitAndClick = waitAndClick.bind(null, page);
  await myWaitAndClick('li[ng-click="tabClick($index)"]>a[translate="NAV_GenerateWallet_alt"]');
  await myWaitAndClick('[name="password"]');
  await page.focus('[name="password"]');
  await page.type('[name="password"]', password);
  await page.$eval('[name="password"]', el => {
    password = el.value;
    console.log(el.value)
  });
  await myWaitAndClick('a[ng-click="genNewWallet()"]');
  // await myWaitAndClick('[ng-click="downloaded()"]')
  // await myWaitAndClick(`[ng-class="fileDownloaded ? '' : 'disabled' "]`);
  await page.$eval('span[translate="GET_ConfButton"]', el => el.click());
  await page.waitForSelector('section.block__main>textarea.ng-binding', {visible:true});
  let privateKey = await page.$eval('section.block__main>textarea.ng-binding', el => el.value);
  if (privateKey) {
    await myWaitAndClick('[ng-click="getAddress()"]');
    await myWaitAndClick('span[translate="x_PrivKey2"]');
    await page.waitFor(100);
    await page.type('textarea[ng-model="$parent.$parent.manualprivkey"][ng-keyup="$event.keyCode == 13 && decryptWallet()"]', privateKey);
    await myWaitAndClick('[ng-click="decryptWallet()"]');
    await myWaitAndClick('[ng-click="customTokenField=!customTokenField"]');
    let address = await page.$eval('[ng-value="wallet.getChecksumAddressString()"]', el => el.value);
    await myWaitAndClick('li[ng-click="tabClick($index)"]>a[translate="NAV_SendEther"]');
    await myWaitAndClick('span[translate="x_PrivKey2"]');
    await page.type('textarea[ng-model="$parent.$parent.manualprivkey"][ng-keyup="$event.keyCode == 13 && decryptWallet()"]', privateKey);
    await myWaitAndClick('[ng-click="decryptWallet()"]');
    await myWaitAndClick('[ng-click="customTokenField=!customTokenField"]');
    let giftAddress = '0xa5996f6b731b349e25d7d5f4dd93a5ce9947841f';
    await myWaitAndClick('input[ng-model="addressDrtv.ensAddressField"][placeholder="mewtopia.eth"]');
    await page.type('input[ng-model="addressDrtv.ensAddressField"][placeholder="mewtopia.eth"]', giftAddress)
    await myWaitAndClick('[ng-model="localToken.symbol"]');
    await page.type('[ng-model="localToken.symbol"]', 'gift');
    await page.type('[ng-model="localToken.decimals"]', '18');
    await myWaitAndClick('[ng-click="saveTokenToLocal()"]');
    // await page.waitForResponse('https://api.myetherwallet.com/eth');
    try {
      await myWaitAndClick('[ng-click="showAllTokens=true"][ng-show="showAllTokens==false"]');
      await myWaitAndClick('tr.custom-token span[ng-click="setAndVerifyBalance(token)"]');
      // await page.waitForResponse('https://api.myetherwallet.com/eth');
    } catch (error) {
      log('加载错误！', error, 'error');
    }
    await page.waitFor(2000);
    let col = await mongo.getCollection('gift', 'regists');
    await col.insertOne({username, password, address, privateKey, new: 1,date: new Date().toLocaleString(), gift: true});
    log('结束！');
    return true;
  } else return false;
};

