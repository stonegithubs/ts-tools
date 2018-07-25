import MyReq from '../lib/request';
import { randomUA } from '../lib/utils';
import HttpsProxyAgent from 'https-proxy-agent'; // https 代理, 用于添加 connection 头



let agent = new HttpsProxyAgent({ host:'170.238.61.148', port:'53281' });

MyReq.getJson('http://httpbin.org/ip', {}, 'get', {
  // proxy: 'https://170.238.61.148:53281',
  rejectUnauthorized: false,
  agent,
  headers: {
    Connection: 'keep-alive',
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'Accept-Encoding': 'gzip, deflate',
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
    'Cache-Control': 'no-cache',
    Host: 'httpbin.org',
    Pragma: 'no-cache',
    'Proxy-Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': 1,
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36'
  }
}).then(
  data => {
    console.log(data);
  },
  err => {
    console.log(err);
  }
);
