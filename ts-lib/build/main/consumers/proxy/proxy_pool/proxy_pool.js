"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongo_1 = __importDefault(require("../../../lib/mongo"));
const utils_1 = require("../../../lib/utils");
const request_1 = __importDefault(require("../../../lib/request"));
const child_process_1 = require("child_process");
const https_proxy_agent_1 = __importDefault(require("https-proxy-agent")); // https 代理, 用于添加 connection 头
//  --------- MongoDB ---------
const mongo = new mongo_1.default();
class ProxyPool {
    constructor(conf = { cwd: '/zhangjianjun/proxy_pool' }) {
        this.conf = conf;
    }
    crawl() {
        let { conf } = this;
        utils_1.log('开始执行爬取任务', 'warn');
        return new Promise((res, rej) => {
            const sp = child_process_1.spawn('python3', ['start.py'], conf);
            let strOut = '';
            let strErr = '';
            sp.stdout.on('data', data => {
                strOut += data;
                utils_1.log(data + '');
            });
            sp.stderr.on('data', data => {
                strErr += data;
                utils_1.log(data + '');
            });
            sp.on('close', code => {
                utils_1.log(`抓取进程退出, 退出代码:\t${code}`, strOut);
                res({ msg: code, output: strOut });
            });
            sp.on('error', err => {
                utils_1.log('执行爬取数据出错!', err, strErr);
                rej({ msg: err, output: strErr });
            });
        });
    }
    async checker() {
        let col = await mongo.getCollection('proxy', 'proxys');
        let cursor = await col.find();
        let chekcParallelCount = 400; // 一次检测400条
        let count = 0;
        let queue = [];
        while (await cursor.hasNext()) {
            queue.push(await cursor.next());
            if (queue.length >= chekcParallelCount || !await cursor.hasNext()) {
                utils_1.log(`从${count}条开始检测\t`, 'warn');
                let success = await this.doCheck(queue);
                count += queue.length;
                utils_1.log(`检测成功, 参与检测\t${queue.length}\t条, 成功\t${success}\t条! 当前已检测\t${count}\t条`, 'warn');
                queue = [];
            }
        }
        utils_1.log(`检测全部完成, 共 \t${count} \t条`, 'warn');
    }
    async doCheck(proxies = []) {
        let col = await mongo.getCollection('proxy', 'proxys');
        let cursor = await col.find();
        let count = 0;
        await Promise.all(proxies.map(async (el, index) => {
            let { protocol, ip, port } = el;
            utils_1.log(`队列中第${index + 1}条开始进行检测!`, 'warn');
            try {
                let params = {
                    headers: {
                        'User-Agent': utils_1.randomUA()
                    }
                };
                let data;
                if (protocol.toLowerCase() === 'https') {
                    let agent = new https_proxy_agent_1.default({ host: ip, port });
                    data = await request_1.default.getJson('http://httpbin.org/ip', {}, 'get', { rejectUnauthorized: false, agent, params });
                }
                else {
                    data = await request_1.default.getJson('http://httpbin.org/ip', {}, 'get', { proxy: `${protocol}://${ip}:${port}`, params });
                }
                utils_1.log(`队列中第${index + 1}条检测完成!`, data, 'warn');
                if (data.origin) {
                    // OK
                    utils_1.log('checker 成功', data);
                    col.updateOne(el, { $set: { lastCheckTime: new Date().toLocaleString() } });
                    count++;
                }
                else {
                    utils_1.log('checker 失败', data, 'warn');
                    col.deleteOne(el);
                }
            }
            catch (error) {
                utils_1.log('checker 异常', error, 'error');
                col.deleteOne(el);
            }
        }));
        return count;
    }
    async task() {
        await this.crawl();
        return this.checker();
    }
}
exports.default = ProxyPool;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJveHlfcG9vbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9jb25zdW1lcnMvcHJveHkvcHJveHlfcG9vbC9wcm94eV9wb29sLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQ0EsK0RBQXVDO0FBQ3ZDLDhDQUFpRztBQUVqRyxtRUFBeUM7QUFDekMsaURBQXNDO0FBQ3RDLDBFQUFnRCxDQUFDLDhCQUE4QjtBQUUvRSwrQkFBK0I7QUFFL0IsTUFBTSxLQUFLLEdBQUcsSUFBSSxlQUFLLEVBQUUsQ0FBQztBQUUxQjtJQUNFLFlBQXFCLE9BQU8sRUFBRSxHQUFHLEVBQUUsMEJBQTBCLEVBQUU7UUFBMUMsU0FBSSxHQUFKLElBQUksQ0FBc0M7SUFBRyxDQUFDO0lBQ25FLEtBQUs7UUFDSCxJQUFJLEVBQUUsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDO1FBQ3BCLFdBQUcsQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDeEIsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRTtZQUM5QixNQUFNLEVBQUUsR0FBRyxxQkFBSyxDQUFDLFNBQVMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ2hELElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztZQUNoQixJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7WUFDaEIsRUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxFQUFFO2dCQUMxQixNQUFNLElBQUksSUFBSSxDQUFDO2dCQUNmLFdBQUcsQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDLENBQUM7WUFDakIsQ0FBQyxDQUFDLENBQUM7WUFDSCxFQUFFLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLEVBQUU7Z0JBQzFCLE1BQU0sSUFBSSxJQUFJLENBQUM7Z0JBQ2Ys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