let toJson = function(body)
{
    key = "";
    value = "";
    res = {};
    mode = 0;
    for(i = 0;i<body.length;i++)
    {
        if(body[i] === '&'){
            res[key] = value; 
            key = "";value = "";
            mode = 0;
        }else if(body[i] === '='){
            mode = 1;
        }else if(mode === 0){
            key += body[i];
        }else value += body[i];
    }
    if(key != ""){
        res[key] = value ; 
    }
    return res;
};

let toId = function(num)
{
    let res = "";
    for(i = 0;i<7;i++)
    {
        //console.log(String.fromCharCode(num % 10 + 48));
        res = String.fromCharCode(num % 10 + 48) + res;
        num = parseInt(num / 10);
    }
    return res;
}

module.exports = {
    toJson,toId
};

console.log(toId(100));