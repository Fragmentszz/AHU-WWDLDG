const vr  = require('./variation');
const Tools = require('./Tools');

let getequal = function(equal,flag)
{
    res = "";
    keys = Object.keys(equal);
    if(keys.length == 0){
        return res;
    }
    var t = "";
    if(flag == 1) t = ' and ';
    else if(flag == 2)  t = ' , ';
    for(let i = 0;i<keys.length;i++){
        if(keys[i] === 'connection'){
            res += equal[keys[i]];
        }else if(keys[i].indexOf("FUNCION") != -1  || keys[i].indexOf("IN") != -1 || keys[i].indexOf("LIKE") != -1){
            res += equal[keys[i]];
        }else if(typeof(equal[keys[i]]) === 'string' && equal[keys[i]] != "NOW()" ){
            res += keys[i] + '=' + '\'' + equal[keys[i]] + '\'';
        }else {
            res += keys[i] + '=' + equal[keys[i]];
        }
        if(i < keys.length - 1){
            res += t;
        }
    }
    return res;
}

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
        res += getequal(equal,1);
        res += restriction;
        return res;
    }
}

let toInsert = function(dic)
{
    action = dic["action"];
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
let tosql = function(sqldic)
{
    var act = sqldic["action"];
    if(act == "select"){
        return toSelect(sqldic);
    }else if(act == "insert"){
        return toInsert(sqldic);
    }else if(act == "update"){
        return toUpdate(sqldic);
    }else if(act == "delete"){
        return toDelete(sqldic);
    }
    return "";
}
dict = {
    action:"select",                     //也可以是"insert"/"delete"/"update",
    object:"customers",                   //操作表名/视图名
    attribute:["*"],                    //---查询需要的属性列名
    equal:{"uid":""},                 //---WHERE 子句中的内容
    set:{"price":1.0},                   //---SET子句中的内容(Update)
    restriction:""                          //限制语句,比如: Order BY price ASC 
}

let toUpdate = function(dic)
{
    let {object,set,equal} = dic;
    res = 'update ';
    res += object;
    res += "\nset\n";
    res += getequal(set,2);
    res += '\nwhere\n';
    res += getequal(equal,1);
    return res;    
}
let toDelete = function(dic)
{
    let {object,equal} = dic;
    res = 'delete ';
    res += '\nfrom ' + object;
    res += '\nwhere\n'
    res += getequal(equal,1);
    res += dic["restriction"];
    return res;
}
t = getequal(
    {"FUNCION1":"totcost = totcost + " + 1.0,"FUNCION2":"credit = credit + 1"},2
);
console.log(t);
module.exports = {
    toSelect,toInsert,toRegister,toUpdate,tosql
};