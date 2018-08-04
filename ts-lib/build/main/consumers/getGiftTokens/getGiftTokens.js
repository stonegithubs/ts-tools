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
    await page.goto('https://www.myetherwallet.com/#generate-wallet');
    let myWaitAndClick = puppeteer_utils_1.waitAndClick.bind(null, page);
    await myWaitAndClick('li[ng-click="tabClick($index)"]>a[translate="NAV_GenerateWallet_alt"]');
    await myWaitAndClick('[name="password"]');
    await page.focus('[name="password"]');
    await page.type('[name="password"]', password);
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
        await col.insertOne({ username, password, address, privateKey, date: new Date().toLocaleString(), gift: true });
        utils_1.log('结束！');
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0R2lmdFRva2Vucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb25zdW1lcnMvZ2V0R2lmdFRva2Vucy9nZXRHaWZ0VG9rZW5zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsNERBQWlEO0FBQ2pELDJDQUFzQztBQUN0QyxxRUFBK0Q7QUFFL0QsSUFBSSxLQUFLLEdBQUcsSUFBSSxlQUFrQixFQUFFLENBQUM7QUFFckMsa0JBQWUsS0FBSyxFQUFFLElBQUksRUFBRSxRQUFRLEdBQUMsY0FBYyxFQUFFLFFBQVEsR0FBRyxjQUFjLEVBQUUsRUFBRTtJQUNoRixNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsZ0RBQWdELENBQUMsQ0FBQztJQUNsRSxJQUFJLGNBQWMsR0FBRyw4QkFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDbkQsTUFBTSxjQUFjLENBQUMsdUVBQXVFLENBQUMsQ0FBQztJQUM5RixNQUFNLGNBQWMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0lBQzFDLE1BQU0sSUFBSSxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0lBQ3RDLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUMvQyxNQUFNLGNBQWMsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO0lBQ3JELG9EQUFvRDtJQUNwRCwwRUFBMEU7SUFDMUUsTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLGtDQUFrQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7SUFDdkUsTUFBTSxJQUFJLENBQUMsZUFBZSxDQUFDLHlDQUF5QyxFQUFFLEVBQUMsT0FBTyxFQUFDLElBQUksRUFBQyxDQUFDLENBQUM7SUFDdEYsSUFBSSxVQUFVLEdBQUcsTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLHlDQUF5QyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzdGLElBQUksVUFBVSxFQUFFO1FBQ2QsTUFBTSxjQUFjLENBQUMsMkJBQTJCLENBQUMsQ0FBQztRQUNsRCxNQUFNLGNBQWMsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO1FBQ3JELE1BQU0sSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN4QixNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsd0dBQXdHLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDdEksTUFBTSxjQUFjLENBQUMsOEJBQThCLENBQUMsQ0FBQztRQUNyRCxNQUFNLGNBQWMsQ0FBQyxpREFBaUQsQ0FBQyxDQUFDO1FBQ3hFLElBQUksT0FBTyxHQUFHLE1BQU0sSUFBSSxDQUFDLEtBQUssQ0FBQyxnREFBZ0QsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNqRyxNQUFNLGNBQWMsQ0FBQyw4REFBOEQsQ0FBQyxDQUFDO1FBQ3JGLE1BQU0sY0FBYyxDQUFDLDhCQUE4QixDQUFDLENBQUM7UUFDckQsTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLHdHQUF3RyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ3RJLE1BQU0sY0FBYyxDQUFDLDhCQUE4QixDQUFDLENBQUM7UUFDckQsTUFBTSxjQUFjLENBQUMsaURBQWlELENBQUMsQ0FBQztRQUN4RSxJQUFJLFdBQVcsR0FBRyw0Q0FBNEMsQ0FBQztRQUMvRCxNQUFNLGNBQWMsQ0FBQywyRUFBMkUsQ0FBQyxDQUFDO1FBQ2xHLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQywyRUFBMkUsRUFBRSxXQUFXLENBQUMsQ0FBQTtRQUN6RyxNQUFNLGNBQWMsQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO1FBQ3ZELE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxnQ0FBZ0MsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUMxRCxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsa0NBQWtDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDMUQsTUFBTSxjQUFjLENBQUMsaUNBQWlDLENBQUMsQ0FBQztRQUN4RCxtRUFBbUU7UUFDbkUsSUFBSTtZQUNGLE1BQU0sY0FBYyxDQUFDLGlFQUFpRSxDQUFDLENBQUM7WUFDeEYsTUFBTSxjQUFjLENBQUMsNkRBQTZELENBQUMsQ0FBQztZQUNwRixtRUFBbUU7U0FDcEU7UUFBQyxPQUFPLEtBQUssRUFBRTtZQUNkLFdBQUcsQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1NBQzlCO1FBQ0QsTUFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3pCLElBQUksR0FBRyxHQUFHLE1BQU0sS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDdkQsTUFBTSxHQUFHLENBQUMsU0FBUyxDQUFDLEVBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxJQUFJLElBQUksRUFBRSxDQUFDLGNBQWMsRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO1FBQzlHLFdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUNaO0FBQ0gsQ0FBQyxDQUFDIn0=