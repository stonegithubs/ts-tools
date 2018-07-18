"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongo_1 = __importDefault(require("../../lib/mongo/"));
const fs_1 = __importDefault(require("fs"));
const http_1 = __importDefault(require("http"));
const https_1 = __importDefault(require("https"));
const http_proxy_1 = __importDefault(require("http-proxy"));
const utils_1 = require("../../lib/utils");
const mongo = new mongo_1.default();
//
// Create a proxy server with latency
//
const proxy = http_proxy_1.default.createProxyServer();
//
// Create your server that makes an operation that waits a while
// and then proxies the request
//
// { http, https, ws, domain, target }
let proxyList = [];
http_1.default.createServer(fnProxy).listen(80);
try {
    let cert = fs_1.default.readFileSync('/etc/letsencrypt/live/www.chosan.cn/fullchain.pem');
    let key = fs_1.default.readFileSync('/etc/letsencrypt/live/www.chosan.cn/privkey.pem');
    let proxyOptions = { ssl: { cert, key }, secure: true };
    let httpsOptions = { cert, key };
    https_1.default.createServer(httpsOptions, fnProxy).listen(443);
}
catch (error) {
    utils_1.log(error, 'error');
}
async function fnProxy(req, res) {
    let proxyConf = proxyList.find(el => el.domain === req.headers.host);
    if (!proxyConf) {
        // 如果没有缓存, 就去数据库查
        let proxyListCol = await mongo.getCollection('proxy', 'proxy');
        proxyConf = await proxyListCol.findOne({ domain: req.headers.host });
        proxyConf && proxyList.push(proxyConf); // 查询到了就放入缓存
    }
    if (proxyConf) {
        proxy.web(req, res, proxyConf);
    }
    else {
        res.writeHead(400, { 'Content-Type': 'application/json;charset=utf-8' });
        res.end(JSON.stringify({ status: 0, msg: '没有对应代理!' }));
    }
}
async function updateProxyList() {
    let proxyListCol = await mongo.getCollection('proxy', 'proxy');
    proxyList = proxyListCol.find().toArray();
}
setInterval(updateProxyList, 1000 * 60 * 3); // 3 分钟同步一次代理数据
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29uc3VtZXJzL2F1dG9SZXZlcnNlUHJveHkvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSw2REFBcUM7QUFDckMsNENBQW9CO0FBQ3BCLGdEQUF3QjtBQUN4QixrREFBMEI7QUFDMUIsNERBQW1DO0FBQ25DLDJDQUFzQztBQUV0QyxNQUFNLEtBQUssR0FBRyxJQUFJLGVBQUssRUFBRSxDQUFDO0FBQzFCLEVBQUU7QUFDRixxQ0FBcUM7QUFDckMsRUFBRTtBQUNGLE1BQU0sS0FBSyxHQUFHLG9CQUFTLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztBQUU1QyxFQUFFO0FBQ0YsZ0VBQWdFO0FBQ2hFLCtCQUErQjtBQUMvQixFQUFFO0FBRUYsc0NBQXNDO0FBQ3RDLElBQUksU0FBUyxHQUFHLEVBQUUsQ0FBQztBQUVuQixjQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUV0QyxJQUFJO0lBQ0YsSUFBSSxJQUFJLEdBQUcsWUFBRSxDQUFDLFlBQVksQ0FBRSxtREFBbUQsQ0FBRSxDQUFDO0lBQ2xGLElBQUksR0FBRyxHQUFHLFlBQUUsQ0FBQyxZQUFZLENBQUMsaURBQWlELENBQUMsQ0FBQztJQUM3RSxJQUFJLFlBQVksR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUM7SUFDeEQsSUFBSSxZQUFZLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUM7SUFFakMsZUFBSyxDQUFDLFlBQVksQ0FBQyxZQUFZLEVBQUUsT0FBTyxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0NBQ3ZEO0FBQUMsT0FBTyxLQUFLLEVBQUU7SUFDZCxXQUFHLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0NBQ3JCO0FBRUQsS0FBSyxrQkFBa0IsR0FBRyxFQUFFLEdBQUc7SUFDN0IsSUFBSSxTQUFTLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEtBQUssR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNyRSxJQUFJLENBQUMsU0FBUyxFQUFFO1FBQ2QsaUJBQWlCO1FBQ2pCLElBQUksWUFBWSxHQUFHLE1BQU0sS0FBSyxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDL0QsU0FBUyxHQUFHLE1BQU0sWUFBWSxDQUFDLE9BQU8sQ0FBQyxFQUFFLE1BQU0sRUFBRSxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7UUFDckUsU0FBUyxJQUFJLFNBQVMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxZQUFZO0tBQ3JEO0lBQ0QsSUFBSSxTQUFTLEVBQUU7UUFDYixLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsU0FBUyxDQUFDLENBQUM7S0FDaEM7U0FBTTtRQUNMLEdBQUcsQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLEVBQUUsY0FBYyxFQUFFLGdDQUFnQyxFQUFFLENBQUMsQ0FBQztRQUN6RSxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDeEQ7QUFDSCxDQUFDO0FBRUQsS0FBSztJQUNILElBQUksWUFBWSxHQUFHLE1BQU0sS0FBSyxDQUFDLGFBQWEsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDL0QsU0FBUyxHQUFHLFlBQVksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUM1QyxDQUFDO0FBRUQsV0FBVyxDQUFDLGVBQWUsRUFBRSxJQUFJLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsZUFBZSJ9