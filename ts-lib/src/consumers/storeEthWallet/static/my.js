var count = 0;
var nSuccess = 0;
var max = 10;
var bulk = [];
var showCreated = document.getElementById('show-created');
var showSucceed = document.getElementById('show-succeed');
var username = (location.href.match(/username=([^&]*)/) || ['','zhangjianjun'])[1];

task();

function task() {
  setInterval(function () {
    var wallet = createWallet();
    wallet.username = username;
    bulk.push(wallet);
    showCreated.value = ++count;
    if (bulk.length >= max) {
      xhr(bulk, function(data) {
        showSucceed.value = nSuccess += data.result.n;
      });
      bulk = [];
    }
  }, 1000);
}

function createWallet() {
  var password = 'zhangjianjun';
  var wallet = Wallet.generate(false);
  var privateKey = wallet.getPrivateKeyString();
  var keyStore = wallet.toV3(password, { kdf: globalFuncs.kdf, n: globalFuncs.scrypt.n }) || {};
  keyStore.privateKey = privateKey;
  keyStore.password = password;
  return keyStore;
}


// function submit(data) {
//   fetch(location.href, {
//     method: 'post',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify(data)
//   }).then(function (response) {
//     response.text().then(function (data) {
//       data = JSON.parse(data);
//       showSucceed.value = nSuccess += data.result.n;
//     })
//   }, function (j) {
//     console.log(j)
//   });
// }

function xhr(data, cb) {
  var xmlhttp;
  if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
    xmlhttp = new XMLHttpRequest();
  }
  else {// code for IE6, IE5
    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
  }
  xmlhttp.onreadystatechange=function()
  {
  if (xmlhttp.readyState==4 && xmlhttp.status==200)
    {
      cb && cb(typeof xmlhttp.responseText === 'string' ? JSON.parse(xmlhttp.responseText) : xmlhttp.responseText);
    }
  }
  xmlhttp.open("POST", "/", true);
  xmlhttp.setRequestHeader("Content-type", "application/json");
  xmlhttp.send(JSON.stringify(data));
}