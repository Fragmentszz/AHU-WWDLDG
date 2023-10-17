let login_dic = {
    "action" : "select",
    "object" : "\"WWDLDG\".registermsg",
    "restriction":""
};
let register_dic = {
    "action" : "insert",
    "object" : "\"WWDLDG\".registermsg",
    "restriction":""
}

let select_c_dic = {
    "action" : "select",
    "object" : "\"WWDLDG\".customer",
    "restriction":""
}

let select_s_dic = {
    "action" : "select",
    "object" : "\"WWDLDG\".seller",
    "restriction":""
}

let select_f_dic = {
    "action" : "select",
    "object" : "\"WWDLDG\".forwarder",
    "restriction":""
}

let select_g_dic = {
    "action" : "select",
    "object" : "\"WWDLDG\".goods",
    "restriction":""
}

let insert_c_dic = {
    "action" : "insert",
    "object" : "\"WWDLDG\".customer",
    "restriction":""
}

let insert_s_dic = {
    "action" : "insert",
    "object" : "\"WWDLDG\".seller",
    "restriction":""
}

let insert_f_dic = {
    "action" : "insert",
    "object" : "\"WWDLDG\".forwarder",
    "restriction":""
}

let insert_g_dic = {
    "action" : "insert",
    "object" : "\"WWDLDG\".goods",
    "restriction":""
}
var numcount = {"c":0,"s":0,"f":0,"g":0,"o":0,"img":0,"ts":0};
let response = {
    "status":0,
    "describe":""
}
function getdic(action,table)
{
    let dic = {"action":action,"object":"\"WWDLDG\"." + table,"restriction":""};
    return dic;
}

function dberr(err,res)
{
    console.log(err);
    var re = response;
    re["status"] = -1;
    re["describe"] = "数据库错误...";
    res.send(re);
}

function send(res,status,describe)
{
    var re = response;
    re["status"] = status;
    re["describe"] = describe;
    res.send(re);
}

getdic("select","ShoppingCarts");
module.exports = {
    login_dic,register_dic,select_c_dic,select_f_dic,select_g_dic,select_s_dic,insert_c_dic,insert_f_dic,insert_g_dic,insert_s_dic,numcount,getdic,response,
    dberr,send
};