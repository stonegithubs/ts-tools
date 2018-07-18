import Mongo from '../../lib/mongo/';
import fs from 'fs';
import http from 'http';
import https from 'https';
import httpProxy from 'http-proxy';
import { log } from '../../lib/utils';

const mongo = new Mongo();
//
// Create a proxy server with latency
//
const proxy = httpProxy.createProxyServer();

//
// Create your server that makes an operation that waits a while
// and then proxies the request
//

// { http, https, ws, domain, target }
let proxyList = [];

http.createServer(fnProxy).listen(80);

try {
  let cert = fs.readFileSync( '/etc/letsencrypt/live/www.chosan.cn/fullchain.pem' );
  let key = fs.readFileSync('/etc/letsencrypt/live/www.chosan.cn/privkey.pem');
  let proxyOptions = { ssl: { cert, key }, secure: true };
  let httpsOptions = { cert, key };

  https.createServer(httpsOptions, fnProxy).listen(443);
} catch (error) {
  log(error, 'error');
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
  } else {
    res.writeHead(400, { 'Content-Type': 'application/json;charset=utf-8' });
    res.end(JSON.stringify({ status: 0, msg: '没有对应代理!' }));
  }
}

async function updateProxyList() {
  let proxyListCol = await mongo.getCollection('proxy', 'proxy');
  proxyList = proxyListCol.find().toArray();
}

setInterval(updateProxyList, 1000 * 60 * 3); // 3 分钟同步一次代理数据
