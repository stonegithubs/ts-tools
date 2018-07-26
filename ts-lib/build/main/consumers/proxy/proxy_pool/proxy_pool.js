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
const dbName = 'proxy';
const colName = 'proxys';
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
            let taskId = setInterval(() => utils_1.log('正在爬取', 'warn'), 6000);
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
                clearInterval(taskId);
                res({ msg: code, output: strOut });
            });
            sp.on('error', err => {
                utils_1.log('执行爬取数据出错!', err, strErr);
                clearInterval(taskId);
                rej({ msg: err, output: strErr });
            });
        });
    }
    async checker(queryDoc = {}) {
        let col = await mongo.getCollection('proxy', 'proxys');
        let cursor = await col.find(queryDoc).addCursorFlag('noCursorTimeout', true); // noCursorTimeout 防止游标超时导致被数据库释放, 需要主动关闭游标
        let chekcParallelCount = 400; // 一次检测400条
        let count = 0;
        let queue = [];
        let round = 0;
        let startTime = Date.now();
        while (await cursor.hasNext()) {
            queue.push(await cursor.next());
            if (queue.length >= chekcParallelCount || !await cursor.hasNext()) {
                utils_1.log(`从${count}条开始检测\t`, 'warn');
                let success = await this.doCheck(queue, ++round);
                count += queue.length;
                utils_1.log(`检测成功, 参与检测\t${queue.length}\t条, 成功\t${success}\t条! 当前已检测\t${count}\t条`, 'warn');
                queue = [];
            }
        }
        cursor.close(); // 主动关闭游标
        utils_1.log(`检测全部完成, 共 \t${count} \t条, 耗时\t${(Date.now() - startTime) / 1000 / 60}\t分钟 `, 'warn');
    }
    async doCheck(proxies = [], round) {
        let col = await mongo.getCollection('proxy', 'proxys');
        let success = 0;
        let count = 0;
        await Promise.all(proxies.map(async (el, index) => {
            let { protocol, ip, port } = el;
            let data;
            let timeout = 1000 * 60 * 4; // 超时设置为4分钟
            utils_1.log(`队列中第${index + 1}条开始进行检测!`, 'warn');
            let id = setInterval(() => utils_1.log(`正在检测第${index + 1}条`, el, 'warn'), 10000);
            try {
                let params = { headers: { 'User-Agent': utils_1.randomUA() }, timeout };
                if (protocol.toLowerCase() === 'https') {
                    let agent = new https_proxy_agent_1.default({ host: ip, port });
                    data = request_1.default.getJson('http://httpbin.org/ip', {}, 'get', Object.assign({ rejectUnauthorized: false, agent }, params));
                }
                else {
                    data = request_1.default.getJson('http://httpbin.org/ip', {}, 'get', Object.assign({ proxy: `${protocol}://${ip}:${port}` }, params));
                }
                data = await Promise.race([data, utils_1.wait(timeout, {})]); // timeout 可能被操作系统的 TCP timeout 覆盖， 此处设置最高4分钟，超过则认为超时
                if (data.origin) {
                    // OK
                    utils_1.log('checker 成功', data);
                    col.updateOne(el, { $set: { lastCheckTime: new Date().toLocaleString() } });
                    success++;
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
            clearInterval(id);
            utils_1.log(`第${round}队列中第${index + 1}条检测完成，已完成${++count}条，共${proxies.length}条，成功${success}条`, 'warn');
        }));
        return success;
    }
    async stripDuplicates(cursor) {
        let proxyPool = {};
        let duplicates = 0;
        let col = await mongo.getCollection(dbName, colName);
        if (!cursor) {
            cursor = await col.find({ lastCheckTime: { $exists: true } });
        }
        return new Promise((res, rej) => {
            cursor.forEach(el => {
                let { protocol, ip, port } = el;
                let key = `${protocol}://${ip}:${port}`;
                if (proxyPool[key]) {
                    duplicates++;
                    col.deleteOne(el);
                }
                else {
                    proxyPool[key] = el;
                }
            }, err => {
                if (err) {
                    rej({ status: 0, count: 0, duplicates, data: err });
                }
                else {
                    let data = Object.values(proxyPool);
                    res({ status: 1, count: data.length, duplicates, data });
                }
            });
        });
    }
    async checkAlive() {
        return this.checker({ lastCheckTime: { $exists: true } });
    }
    async task() {
        await this.crawl();
        await this.checker();
        let { duplicates } = await this.stripDuplicates();
        utils_1.log(`task 完成, 清理重复数据${duplicates}条`, 'warn');
    }
}
exports.default = ProxyPool;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJveHlfcG9vbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9jb25zdW1lcnMvcHJveHkvcHJveHlfcG9vbC9wcm94eV9wb29sLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQ0EsK0RBQXVDO0FBQ3ZDLDhDQUFpRztBQUVqRyxtRUFBeUM7QUFDekMsaURBQXNDO0FBQ3RDLDBFQUFnRCxDQUFDLDhCQUE4QjtBQUUvRSwrQkFBK0I7QUFFL0IsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDO0FBQ3ZCLE1BQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQztBQUN6QixNQUFNLEtBQUssR0FBRyxJQUFJLGVBQUssRUFBRSxDQUFDO0FBRTFCO0lBQ0UsWUFBcUIsT0FBTyxFQUFFLEdBQUcsRUFBRSwwQkFBMEIsRUFBRTtRQUExQyxTQUFJLEdBQUosSUFBSSxDQUFzQztJQUFHLENBQUM7SUFDbkUsS0FBSztRQUNILElBQUksRUFBRSxJQUFJLEVBQUUsR0FBRyxJQUFJLENBQUM7UUFDcEIsV0FBRyxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUN4QixPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFO1lBQzlCLE1BQU0sRUFBRSxHQUFHLHFCQUFLLENBQUMsU0FBUyxFQUFFLENBQUMsVUFBVSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDaEQsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDO1lBQ2hCLElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztZQUNoQixJQUFJLE1BQU0sR0FBRyxXQUFXLENBQUMsR0FBRyxFQUFFLENBQUMsV0FBRyxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUMxRCxFQUFFLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLEVBQUU7Z0JBQzFCLE1BQU0sSUFBSSxJQUFJLENBQUM7Z0JBQ2YsV0FBRyxDQUFDLElBQUksR0FBRyxFQUFFLENBQUMsQ0FBQztZQUNqQixDQUFDLENBQUMsQ0FBQztZQUNILEVBQUUsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsRUFBRTtnQkFDMUIsTUFBTSxJQUFJLElBQUksQ0FBQztnQkFDZixXQUFHLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQyxDQUFDO1lBQ2pCLENBQUMsQ0FBQyxDQUFDO1lBQ0gsRUFBRSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLEVBQUU7Z0JBQ3BCLFdBQUcsQ0FBQyxrQkFBa0IsSUFBSSxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7Z0JBQ3RDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDdEIsR0FBRyxDQUFDLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQztZQUNyQyxDQUFDLENBQUMsQ0FBQTtZQUNGLEVBQUUsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxFQUFFO2dCQUNuQixXQUFHLENBQUMsV0FBVyxFQUFFLEdBQUcsRUFBRSxNQUFNLENBQUMsQ0FBQztnQkFDOUIsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUN0QixHQUFHLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDO1lBQ3BDLENBQUMsQ0FBQyxDQUFBO1FBQ0osQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDO0lBQ0QsS0FBSyxDQUFDLE9BQU8sQ0FBQyxRQUFRLEdBQUcsRUFBRTtRQUN6QixJQUFJLEdBQUcsR0FBRyxNQUFNLEtBQUssQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ3ZELElBQUksTUFBTSxHQUFHLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxhQUFhLENBQUMsaUJBQWlCLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBRSwyQ0FBMkM7UUFDMUgsSUFBSSxrQkFBa0IsR0FBRyxHQUFHLENBQUMsQ0FBQyxXQUFXO1FBQ3pDLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztRQUNkLElBQUksS0FBSyxHQUFHLEVBQUUsQ0FBQztRQUNmLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztRQUNkLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUMzQixPQUFNLE1BQU0sTUFBTSxDQUFDLE9BQU8sRUFBRSxFQUFFO1lBQzVCLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztZQUNoQyxJQUFJLEtBQUssQ0FBQyxNQUFNLElBQUksa0JBQWtCLElBQUksQ0FBQyxNQUFNLE1BQU0sQ0FBQyxPQUFPLEVBQUUsRUFBRTtnQkFDakUsV0FBRyxDQUFDLElBQUksS0FBSyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7Z0JBQ2hDLElBQUksT0FBTyxHQUFHLE1BQU0sSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztnQkFDakQsS0FBSyxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUM7Z0JBQ3RCLFdBQUcsQ0FBQyxlQUFlLEtBQUssQ0FBQyxNQUFNLFlBQVksT0FBTyxlQUFlLEtBQUssS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO2dCQUNyRixLQUFLLEdBQUcsRUFBRSxDQUFDO2FBQ1o7U0FDRjtRQUNELE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFFLFNBQVM7UUFDMUIsV0FBRyxDQUFDLGVBQWUsS0FBSyxhQUFjLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLFNBQVMsQ0FBQyxHQUFHLElBQUksR0FBRyxFQUFHLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztJQUM5RixDQUFDO0lBRUQsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEdBQUcsRUFBRSxFQUFFLEtBQUs7UUFDL0IsSUFBSSxHQUFHLEdBQUcsTUFBTSxLQUFLLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztRQUN2RCxJQUFJLE9BQU8sR0FBRyxDQUFDLENBQUM7UUFDaEIsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ2QsTUFBTSxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsRUFBRTtZQUNoRCxJQUFJLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUM7WUFDaEMsSUFBSSxJQUFJLENBQUM7WUFDVCxJQUFJLE9BQU8sR0FBRyxJQUFJLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFFLFdBQVc7WUFDekMsV0FBRyxDQUFDLE9BQU8sS0FBSyxHQUFHLENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQ3hDLElBQUksRUFBRSxHQUFHLFdBQVcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxXQUFHLENBQUMsUUFBUSxLQUFLLEdBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxFQUFFLE1BQU0sQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQ3ZFLElBQUk7Z0JBQ0YsSUFBSSxNQUFNLEdBQUcsRUFBRSxPQUFPLEVBQUUsRUFBRSxZQUFZLEVBQUUsZ0JBQVEsRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUE7Z0JBQy9ELElBQUksUUFBUSxDQUFDLFdBQVcsRUFBRSxLQUFLLE9BQU8sRUFBRTtvQkFDdEMsSUFBSSxLQUFLLEdBQUcsSUFBSSwyQkFBZSxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO29CQUNwRCxJQUFJLEdBQUcsaUJBQUssQ0FBQyxPQUFPLENBQUMsdUJBQXVCLEVBQUUsRUFBRSxFQUFFLEtBQUssa0JBQUksa0JBQWtCLEVBQUUsS0FBSyxFQUFFLEtBQUssSUFBSyxNQUFNLEVBQUcsQ0FBQztpQkFDM0c7cUJBQU07b0JBQ0wsSUFBSSxHQUFHLGlCQUFLLENBQUMsT0FBTyxDQUFDLHVCQUF1QixFQUFFLEVBQUUsRUFBRSxLQUFLLGtCQUFJLEtBQUssRUFBRSxHQUFHLFFBQVEsTUFBTSxFQUFFLElBQUksSUFBSSxFQUFFLElBQUssTUFBTSxFQUFHLENBQUM7aUJBQy9HO2dCQUNELElBQUksR0FBRyxNQUFNLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsWUFBSSxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBRyxxREFBcUQ7Z0JBQzdHLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtvQkFDZixLQUFLO29CQUNMLFdBQUcsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLENBQUM7b0JBQ3hCLEdBQUcsQ0FBQyxTQUFTLENBQUMsRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsYUFBYSxFQUFFLElBQUksSUFBSSxFQUFFLENBQUMsY0FBYyxFQUFFLEVBQUUsRUFBQyxDQUFDLENBQUM7b0JBQzNFLE9BQU8sRUFBRSxDQUFDO2lCQUNYO3FCQUFNO29CQUNMLFdBQUcsQ0FBQyxZQUFZLEVBQUUsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO29CQUNoQyxHQUFHLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2lCQUNuQjthQUNGO1lBQUMsT0FBTyxLQUFLLEVBQUU7Z0JBQ2QsV0FBRyxDQUFDLFlBQVksRUFBRSxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7Z0JBQ2xDLEdBQUcsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUM7YUFDbkI7WUFDRCxhQUFhLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDbEIsV0FBRyxDQUFDLElBQUksS0FBSyxPQUFPLEtBQUssR0FBRyxDQUFDLFlBQVksRUFBRSxLQUFLLE1BQU0sT0FBTyxDQUFDLE1BQU0sT0FBTyxPQUFPLEdBQUcsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNqRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ0osT0FBTyxPQUFPLENBQUM7SUFDakIsQ0FBQztJQUVELEtBQUssQ0FBQyxlQUFlLENBQUMsTUFBTztRQUMzQixJQUFJLFNBQVMsR0FBRyxFQUFFLENBQUM7UUFDbkIsSUFBSSxVQUFVLEdBQUcsQ0FBQyxDQUFDO1FBQ25CLElBQUksR0FBRyxHQUFHLE1BQU0sS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDckQsSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNYLE1BQU0sR0FBRyxNQUFNLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxhQUFhLEVBQUUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLEVBQUMsQ0FBQyxDQUFDO1NBQzlEO1FBQ0QsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRTtZQUM5QixNQUFNLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxFQUFFO2dCQUNsQixJQUFJLEVBQUUsUUFBUSxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUM7Z0JBQ2hDLElBQUksR0FBRyxHQUFHLEdBQUcsUUFBUSxNQUFNLEVBQUUsSUFBSSxJQUFJLEVBQUUsQ0FBQztnQkFDeEMsSUFBSSxTQUFTLENBQUMsR0FBRyxDQUFDLEVBQUU7b0JBQ2xCLFVBQVUsRUFBRSxDQUFDO29CQUNiLEdBQUcsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLENBQUM7aUJBQ25CO3FCQUFNO29CQUNMLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7aUJBQ3JCO1lBQ0gsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxFQUFFO2dCQUNQLElBQUksR0FBRyxFQUFFO29CQUNQLEdBQUcsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7aUJBQ3JEO3FCQUFNO29CQUNMLElBQUksSUFBSSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7b0JBQ3BDLEdBQUcsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7aUJBQzFEO1lBQ0gsQ0FBQyxDQUFDLENBQUE7UUFDSixDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUM7SUFFRCxLQUFLLENBQUMsVUFBVTtRQUNkLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFDLGFBQWEsRUFBRSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsRUFBQyxDQUFDLENBQUM7SUFDMUQsQ0FBQztJQUVELEtBQUssQ0FBQyxJQUFJO1FBQ1IsTUFBTSxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDbkIsTUFBTSxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDckIsSUFBSSxFQUFFLFVBQVUsRUFBRSxHQUFHLE1BQU0sSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO1FBQ2xELFdBQUcsQ0FBQyxrQkFBa0IsVUFBVSxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDL0MsQ0FBQztDQUNGO0FBaElELDRCQWdJQyJ9