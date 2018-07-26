import AutoProxy from "../lib/proxy/autoProxy/autoProxy";

let proxy = new AutoProxy()


proxy.send('http://httpbin.org/ip', {}, 'get', { json: true }).then(data => {
  console.log(data);
}, err => {
  console.log(err);
})