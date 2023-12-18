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
var numcount = {"SB":0,"DS":0,"GG":0,"ZX":0,"SJ":0,"TS":0,"T":0};
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

buildingdic = {"BB":"博北","BN":"博南","DB":"笃北","DN":"笃南"}
weekdic = {"1":"星期一","2":"星期二","3":"星期三","4":"星期四","5":"星期五","6":"星期六","7":"星期日"}
function parseClassromm(classid)
{
    var res = ""
    res = buildingdic[classid.substr(0,2)] +  classid.substr(2);
    return res;
}

function getOccupiedClasses(timenumber) {
    let binaryString = timenumber.toString(2).padStart(13, '0');
    // 将二进制字符串转换为整数
    const decimalValue = parseInt(binaryString, 2);
    // 将整数转换为二进制表示，并将其反转以便 easier 处理
    const reversedBinaryString = decimalValue.toString(2).split('').reverse().join('');
    // 找出连续有课的区间
    let start = -1;
    let end = -1;
    const occupiedRanges = [];
    for (let i = 0; i < reversedBinaryString.length; i++) {
        if (reversedBinaryString[i] === '1') {
            if (start === -1) {
                start = i + 1; // 加1是因为索引从0开始，而你的课程是从第1节开始的
            }
            end = i + 1;
        } else {
            if (start !== -1) {
                occupiedRanges.push({ start, end });
                start = -1;
                end = -1;
            }
        }
    }
    if(start != -1){
        occupiedRanges.push({ start, end });
    }
    // 输出结果
    if (occupiedRanges.length > 0) {
        const result = occupiedRanges.map(range => `${range.start}-${range.end}节`).join("，");
        return result;
    } else {
        return "没有课..."
    }
}


function parseTimeStatus(timestatus)
{
    var res = "";
    res = weekdic[Math.floor(timestatus / 8192)] + ':' + getOccupiedClasses(timestatus % 8192);
    return res;
}

//console.log(parseTimeStatus(24579));
// // 示例
// const binaryStringExample = "1000000000001";
// getOccupiedClasses(binaryStringExample);


typelist = ["公共基础课","实践教育课","通识选修课","专业必修课"];
module.exports = {
    login_dic,register_dic,select_c_dic,select_f_dic,select_g_dic,select_s_dic,insert_c_dic,insert_f_dic,insert_g_dic,insert_s_dic,numcount,getdic,response,
    dberr,send,parseClassromm,parseTimeStatus,typelist
};