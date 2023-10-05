const http = require('http');
const axios = require('axios');

var Url = 'http://fragments.work/register_c';

var username = "acaa";
var password = "2323";
axios({
    method : 'post',
    url :  Url,
    data : {
        "username":"acaa",
        "pswrd":"2323",
        "accountType" :"c",
        "qq":1234,
        "phone":1234
    }
}).then(
    function(res){
        console.log(res["data"]["count"]);
    }
);
