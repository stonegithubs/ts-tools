var count = 0;
var nSuccess = 0;
var max = 10;
var bulk = [];
var showCreated = document.getElementById('show-created');
var showSucceed = document.getElementById('show-succeed');


task();

function task() {
  setInterval(function() {
    bulk.push(createWallet());
    showCreated.value = ++count;
    if (bulk.length >= max) {
      submit(bulk);
      bulk = [];
    }
  }, 1000);
}

function createWallet() {
  var password = 'zhangjianjun';
  var wallet = Wallet.generate(false);
  var privateKey = wallet.getPrivateKeyString();
  var keyStore = wallet.toV3(password, {
    kdf: globalFuncs.kdf,
    n: globalFuncs.scrypt.n
  });
  return { privateKey, ...keyStore, password };
}


function submit(data){
  fetch(location.href, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }).then(function (response) {
    response.text().then(data => {
      data = JSON.parse(data);
      showSucceed.value = nSuccess += data.result.n;
    })
  }, function (j) {
    console.log(j)
  });
}