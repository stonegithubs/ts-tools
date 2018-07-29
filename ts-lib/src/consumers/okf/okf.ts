import Requester from "../../lib/utils/declarations/requester";
import MyReq from "../../lib/request";
import { getRandomInt, getRandomStr, log, throwError, wait, randomUA } from '../../lib/utils';

export default class OKF implements Requester {
    static baseURL: 'http://www.okf.com';
    static headers: {
        Host: 'www.okf.com',
        Pragma: 'no-cache',
        Referer: 'http://www.okf.com/index/publics/pwdregister.html',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
    requester: MyReq = new MyReq('http://www.okf.com', { json: false });

    async getData(url, data?, method = 'post', params?) {
        let { requester } = this;
        let headers = {
            Host: 'www.okf.com',
            Referer: 'http://www.okf.com/index/publics/pwdregister.html',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'X-Requested-With': 'XMLHttpRequest',
            'User-Agent': 'Mozilla/5.0 (Linux; Android 7.0; FRD-AL00 Build/HUAWEIFRD-AL00; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/53.0.2785.49 Mobile MQQBrowser/6.2 TBS/043508 Safari/537.36 V1_AND_SQ_7.1.0_0_TIM_D TIM2.0/1.2.0.1692 QQ/6.5.5 NetType/2G WebP/0.3.0 Pixel/1080 IMEI/869953022249635'
        };
        let result = await requester.workFlow(url, data, method, { headers, ...params });
        if (typeof result === 'string') {
            try {
                return JSON.parse(result);
            } catch (error) {
            }
        }
        return result;
    }

    async getCaptcha() {
        return this.getData('/index/publics/startcaptchaservlet.html', {}, 'get');
    }

    async sendMsg(form?) {
        let mobile = '15683351915';
        let { geetest_challenge, geetest_validate, geetest_seccode } = form;
        let data = {
            mobile,
            geetest_challenge,
            geetest_validate,
            geetest_seccode
        } // 不要奇怪为什么我不直接用 form，这个参数就需要这样的顺序，不然就是报错，我也很无奈啊，找了好久。。。
        let result = await this.getData('/index/code/getcode.html', data);
        if (result.code === 1) {
            log('发送成功！');
        }
    }

    async task(captchaObj) {
        this.sendMsg(captchaObj);
    }
}