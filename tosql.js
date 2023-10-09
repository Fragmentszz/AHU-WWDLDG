const vr  = require('./variation');
const Tools = require('./Tools');

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


let toInsert = function(dic)
{
    action = dic["action"]
    if(action === 'insert'){
        
        let {object,equal} = dic;
        res = 'insert';
        res += '\ninto ' + object + '\nValues\n(';
        keys = Object.keys(equal);
        tmp = "";
        for(i = 0;i<keys.length - 1;i++){
            if(typeof(equal[keys[i]]) === 'string'){
                res += '\'' + equal[keys[i]] + '\'' + ', ';
            }else {
                res += equal[keys[i]] + ', ';
            }
        }
        if(typeof(equal[keys[keys.length - 1]]) === 'string'){
            res += '\'' + equal[keys[keys.length - 1]] + '\'';
        }else {
            res += equal[keys[keys.length - 1]];
        }
        res += ');';
        return res;
    }
}

let toRegister = function(type,body,numcount)
{
    if(type == 's'){
        sqldic = {...vr.insert_s_dic,"equal":{
            "sid" : type + Tools.toId(numcount[type] + 1),
            "phone" : body.dic["phone"],
            "qq" : body.dic["qq"],
            "address" : ""
        }};
    }else if(type == 'c'){
        sqldic = {...vr.insert_c_dic,"equal":{
            "cid" : type + Tools.toId(numcount[type] + 1),
            "phone" : body.dic["phone"],
            "qq" : body.dic["qq"]
        }};
    }else if(type == 'f'){
        sqldic = {...vr.insert_f_dic,"equal":{
            "fid" : type + Tools.toId(numcount[type] + 1),
            "totcost" : 0,
            "credit" : 4
        }};
    }
    return sqldic;
}


module.exports = {
    toSelect,toInsert,toRegister
};