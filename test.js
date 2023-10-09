const http = require('http');
const axios = require('axios');
const vr = require('./variation');
// var Url = 'http://fragments.work/register_c';

// var username = "acaa";
// var password = "2323";
// axios({
//     method : 'post',
//     url :  Url,
//     data : {
//         "username":"acaa",
//         "pswrd":"2323",
//         "accountType" :"c",
//         "qq":1234,
//         "phone":1234
//     }
// }).then(
//     function(res){
//         console.log(res["data"]["count"]);
//     }
// );
let toSelect = function(dic)
{
    action = dic["action"]
    var res = "";
    if(action === 'select'){
        let {object,restriction,attribute,equal} = dic;
        res = 'select ';
        for(i=0;i<attribute.length-1;i++){
            res += attribute[i] + ','
        }
        res += attribute[attribute.length - 1];
        res += '\nfrom ' + object;
        keys = Object.keys(equal);
        if(keys.length == 0){
            res += restriction;
            return res;
        }
        res += '\nwhere\n';
        tmp = "";
        for(let i = 0;i<keys.length - 1;i++){
            console.log(keys[i]);
            if(keys[i] === 'connection'){
                res += equal[keys[i]] + ' and ';
            }else if(keys[i].indexOf("IN") != -1 || keys[i].indexOf("LIKE") != -1){
                res += equal[keys[i]] + ' and ';
            }else if(typeof(equal[keys[i]]) === 'string'){
                res += keys[i] + '=' + '\'' + equal[keys[i]] + '\'' + ' and ';
            }else {
                res += keys[i] + '=' + equal[keys[i]] + ' and ';
            }
        }
        if(keys[keys.length - 1] === 'connection' || keys[keys.length - 1].indexOf("IN") != -1 || keys[keys.length - 1].indexOf("LIKE") != -1){
            res += equal[keys[keys.length - 1]];
        }else if(typeof(equal[keys[keys.length - 1]]) === 'string'){
            res += keys[keys.length - 1] + '=' + '\'' + equal[keys[keys.length - 1]] + '\'';
        }else {
            res += keys[keys.length - 1] + '=' + equal[keys[keys.length - 1]];
        }
        res += restriction;
        return res;
    }
}
body = {dic:{lab:"null",gname:"a","restriction":"DESC"}};
var sqldic = {...vr.select_g_dic,"attribute":["gid"],"equal":{}};
        sqldic["object"] = "\"WWDLDG\".goods";
        if(body.dic["lab"] != "null"){
            sqldic["equal"]["lab"] = body.dic["lab"];
        }
        if(body.dic["gname"] != ""){
            sqldic["equal"]["LIKE"] ="\"WWDLDG\".goods.gname" + " LIKE " + "\'%" + body.dic["gname"] + "%\'";
        }
        if(body.dic["restriction"] != ""){
            sqldic["restriction"] = "\nOrder BY price " + body.dic["restriction"];
        }

console.log(sqldic);
console.log(toSelect(sqldic));