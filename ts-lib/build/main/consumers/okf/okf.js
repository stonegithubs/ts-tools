"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_1 = __importDefault(require("../../lib/request"));
const utils_1 = require("../../lib/utils");
class OKF {
    constructor() {
        this.requester = new request_1.default('http://www.okf.com', { json: false });
    }
    async getData(url, data, method = 'post', params) {
        let { requester } = this;
        let headers = {
            Host: 'www.okf.com',
            Referer: 'http://www.okf.com/index/publics/pwdregister.html',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'X-Requested-With': 'XMLHttpRequest',
            'User-Agent': 'Mozilla/5.0 (Linux; Android 7.0; FRD-AL00 Build/HUAWEIFRD-AL00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/53.0.2785.49 Mobile MQQBrowser/6.2 TBS/043508 Safari/537.36 V1_AND_SQ_7.1.0_0_TIM_D TIM2.0/1.2.0.1692 QQ/6.5.5 NetType/2G WebP/0.3.0 Pixel/1080 IMEI/869953022249635'
        };
        let result = await requester.workFlow(url, data, method, Object.assign({ headers }, params));
        if (typeof result === 'string') {
            try {
                return JSON.parse(result);
            }
            catch (error) {
            }
        }
        return result;
    }
    async getCaptcha() {
        return this.getData('/index/publics/startcaptchaservlet.html', {}, 'get');
    }
    async sendMsg(form) {
        let mobile = '15683351915';
        let { geetest_challenge, geetest_validate, geetest_seccode } = form;
        let data = {
            mobile,
            geetest_challenge,
            geetest_validate,
            geetest_seccode
        }; // 不要奇怪为什么我不直接用 form，这个参数就需要这样的顺序，不然就是报错，我也很无奈啊，找了好久。。。
        let result = await this.getData('/index/code/getcode.html', data);
        if (result.code === 1) {
            utils_1.log('发送成功！');
        }
    }
    async task(captchaObj) {
        this.sendMsg(captchaObj);
    }
}
exports.default = OKF;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2tmLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbnN1bWVycy9va2Yvb2tmLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQ0EsZ0VBQXNDO0FBQ3RDLDJDQUE4RjtBQUU5RjtJQUFBO1FBUUksY0FBUyxHQUFVLElBQUksaUJBQUssQ0FBQyxvQkFBb0IsRUFBRSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO0lBMkN4RSxDQUFDO0lBekNHLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLElBQUssRUFBRSxNQUFNLEdBQUcsTUFBTSxFQUFFLE1BQU87UUFDOUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxHQUFHLElBQUksQ0FBQztRQUN6QixJQUFJLE9BQU8sR0FBRztZQUNWLElBQUksRUFBRSxhQUFhO1lBQ25CLE9BQU8sRUFBRSxtREFBbUQ7WUFDNUQsY0FBYyxFQUFFLGtEQUFrRDtZQUNsRSxrQkFBa0IsRUFBRSxnQkFBZ0I7WUFDcEMsWUFBWSxFQUFFLG9TQUFvUztTQUNyVCxDQUFDO1FBQ0YsSUFBSSxNQUFNLEdBQUcsTUFBTSxTQUFTLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsTUFBTSxrQkFBSSxPQUFPLElBQUssTUFBTSxFQUFHLENBQUM7UUFDakYsSUFBSSxPQUFPLE1BQU0sS0FBSyxRQUFRLEVBQUU7WUFDNUIsSUFBSTtnQkFDQSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7YUFDN0I7WUFBQyxPQUFPLEtBQUssRUFBRTthQUNmO1NBQ0o7UUFDRCxPQUFPLE1BQU0sQ0FBQztJQUNsQixDQUFDO0lBRUQsS0FBSyxDQUFDLFVBQVU7UUFDWixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMseUNBQXlDLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQzlFLENBQUM7SUFFRCxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUs7UUFDZixJQUFJLE1BQU0sR0FBRyxhQUFhLENBQUM7UUFDM0IsSUFBSSxFQUFFLGlCQUFpQixFQUFFLGdCQUFnQixFQUFFLGVBQWUsRUFBRSxHQUFHLElBQUksQ0FBQztRQUNwRSxJQUFJLElBQUksR0FBRztZQUNQLE1BQU07WUFDTixpQkFBaUI7WUFDakIsZ0JBQWdCO1lBQ2hCLGVBQWU7U0FDbEIsQ0FBQSxDQUFDLHVEQUF1RDtRQUN6RCxJQUFJLE1BQU0sR0FBRyxNQUFNLElBQUksQ0FBQyxPQUFPLENBQUMsMEJBQTBCLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDbEUsSUFBSSxNQUFNLENBQUMsSUFBSSxLQUFLLENBQUMsRUFBRTtZQUNuQixXQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDaEI7SUFDTCxDQUFDO0lBRUQsS0FBSyxDQUFDLElBQUksQ0FBQyxVQUFVO1FBQ2pCLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDN0IsQ0FBQztDQUNKO0FBbkRELHNCQW1EQyJ9