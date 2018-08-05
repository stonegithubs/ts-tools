"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongo_1 = __importDefault(require("../../lib/mongo"));
const utils_1 = require("../../lib/utils");
const puppeteer_utils_1 = require("../../lib/utils/puppeteer-utils");
let mongo = new mongo_1.default();
exports.default = async (page, username = 'zhangjianjun', password = 'Zhang199381*') => {
    await page.goto('https://www.myetherwallet.com/#generate-wallet', { timeout: 1000 * 90 });
    let myWaitAndClick = puppeteer_utils_1.waitAndClick.bind(null, page);
    await myWaitAndClick('li[ng-click="tabClick($index)"]>a[translate="NAV_GenerateWallet_alt"]');
    await myWaitAndClick('[name="password"]');
    await page.focus('[name="password"]');
    await page.type('[name="password"]', password);
    await page.$eval('[name="password"]', el => {
        password = el.value;
        console.log(el.value);
    });
    await myWaitAndClick('a[ng-click="genNewWallet()"]');
    // await myWaitAndClick('[ng-click="downloaded()"]')
    // await myWaitAndClick(`[ng-class="fileDownloaded ? '' : 'disabled' "]`);
    await page.$eval('span[translate="GET_ConfButton"]', el => el.click());
    await page.waitForSelector('section.block__main>textarea.ng-binding', { visible: true });
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
        await page.type('input[ng-model="addressDrtv.ensAddressField"][placeholder="mewtopia.eth"]', giftAddress);
        await myWaitAndClick('[ng-model="localToken.symbol"]');
        await page.type('[ng-model="localToken.symbol"]', 'gift');
        await page.type('[ng-model="localToken.decimals"]', '18');
        await myWaitAndClick('[ng-click="saveTokenToLocal()"]');
        // await page.waitForResponse('https://api.myetherwallet.com/eth');
        try {
            await myWaitAndClick('[ng-click="showAllTokens=true"][ng-show="showAllTokens==false"]');
            await myWaitAndClick('tr.custom-token span[ng-click="setAndVerifyBalance(token)"]');
            // await page.waitForResponse('https://api.myetherwallet.com/eth');
        }
        catch (error) {
            utils_1.log('加载错误！', error, 'error');
        }
        await page.waitFor(2000);
        let col = await mongo.getCollection('gift', 'regists');
        await col.insertOne({ username, password, address, privateKey, new: 1, date: new Date().toLocaleString(), gift: true });
        utils_1.log('结束！');
        return true;
    }
    else
        return false;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0R2lmdFRva2Vucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb25zdW1lcnMvZ2V0R2lmdFRva2Vucy9nZXRHaWZ0VG9rZW5zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsNERBQWlEO0FBQ2pELDJDQUFzQztBQUN0QyxxRUFBK0Q7QUFFL0QsSUFBSSxLQUFLLEdBQUcsSUFBSSxlQUFrQixFQUFFLENBQUM7QUFFckMsa0JBQWUsS0FBSyxFQUFFLElBQUksRUFBRSxRQUFRLEdBQUMsY0FBYyxFQUFFLFFBQVEsR0FBRyxjQUFjLEVBQUUsRUFBRTtJQUNoRixNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsZ0RBQWdELEVBQUUsRUFBQyxPQUFPLEVBQUUsSUFBSSxHQUFHLEVBQUUsRUFBQyxDQUFDLENBQUM7SUFDeEYsSUFBSSxjQUFjLEdBQUcsOEJBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ25ELE1BQU0sY0FBYyxDQUFDLHVFQUF1RSxDQUFDLENBQUM7SUFDOUYsTUFBTSxjQUFjLENBQUMsbUJBQW1CLENBQUMsQ0FBQztJQUMxQyxNQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsbUJBQW1CLENBQUMsQ0FBQztJQUN0QyxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsbUJBQW1CLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDL0MsTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLG1CQUFtQixFQUFFLEVBQUUsQ0FBQyxFQUFFO1FBQ3pDLFFBQVEsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDO1FBQ3BCLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFBO0lBQ3ZCLENBQUMsQ0FBQyxDQUFDO0lBQ0gsTUFBTSxjQUFjLENBQUMsOEJBQThCLENBQUMsQ0FBQztJQUNyRCxvREFBb0Q7SUFDcEQsMEVBQTBFO0lBQzFFLE1BQU0sSUFBSSxDQUFDLEtB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