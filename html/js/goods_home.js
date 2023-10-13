var nowid = 0;
var gids = [];
var over = 0;
let dic = ["describe","price","qq","lab"];
let dic2 = ["描述：","价格:￥","卖家QQ:","类别:"];
let trans = {"other":"其他","life":"生活用品","study":"学习用品","transport":"交通工具"};
var nowlab = "null";
function refresh()
{
    var items = document.getElementsByClassName("item");
    while (items.length > 0) {
        items[0].parentNode.removeChild(items[0]);
    }
    for(let i = 0; i < 5 && nowid < gids.length; i++) {
        create(nowid);
        nowid++;
    }
}
document.addEventListener("DOMContentLoaded", function() {
    getGids(document.getElementById("allgoods"));
});
window.onscroll = function() {
        // 判断是否滚动到页面底部
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
            // 滚动到页面底部时执行的代码
            if(nowid < gids.length && !over){
                create(nowid);
                nowid++;
            }
            else if(!over){
                alert("到底了");
                over = 1;
            }
        }
};
function getGids(button)
{
    let attr = button.getAttribute("attr");
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/show_goods", false);
    xhr.onload = function() {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            gids = response["gids"];
            console.log(gids.length);
            nowlab = attr;
            nowid = 0;
            refresh();
            over = 0;
        } else {
            document.getElementById("response").innerHTML = "请求失败，状态码：" + xhr.status;
        }
    };
    var requestData = {
        "attr":attr
    };
    // 将数据转换为JSON格式
    var jsonRequestData = JSON.stringify(requestData);
    // 发送请求
    xhr.send(jsonRequestData);
}
function search_goods(sqldic)
{
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/search_goods_byNames", false);
    xhr.onload = function() {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            gids = response["gids"];
            console.log(gids.length);
            nowid = 0;
            refresh();
            over = 0;
        } else {
            document.getElementById("response").innerHTML = "请求失败，状态码：" + xhr.status;
        }
    };
    // 将数据转换为JSON格式
    var jsonRequestData = JSON.stringify(sqldic);
    // 发送请求
    xhr.send(jsonRequestData);
}
function toString(num)
{
    var res = "";
    do{
        res = String.fromCharCode(num % 10 + 48) + res;
        num = parseInt(num / 10);
    }while(num > 0)
    return res;
}
function Post(id)
{
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/addintoSC", false);
    xhr.onload = function() {
        if(xhr.status == 200){
            var result = JSON.parse(xhr.responseText);
            alert(result["describe"]);
        }else{
            alert("未知错误..");
        }
    }
    var requestData = {
        "gid":gids[id]
    };
    // 将数据转换为JSON格式
    var jsonRequestData = JSON.stringify(requestData);
    // 发送请求
    xhr.send(jsonRequestData);
}
function create(nowgoods)
{
    // if(nowgoods >= gids.length){nowgoods--;}
    var xhr = new XMLHttpRequest();
    let gid = gids[nowgoods];
    xhr.open("POST", "/select_goods", false);
    xhr.onload = function() {
        if (xhr.status === 200) {
            // 请求成功，处理响应数据
            var result = JSON.parse(xhr.responseText);
            console.log(result);
            var index = "item" + toString(nowgoods);
            var div2 = document.createElement("div");
            var div = document.createElement("div");
            div2.className = "item";
            div.className = "item_detail";
            var p;
            p = document.createElement('h3');
            p.innerHTML = "物品名称:" + result["gname"];
            div.appendChild(p);
            for(i=0;i<4;i++)
            {
                p = document.createElement('p');
                if(i != 3)  {
                    p.id = index + '_' + dic[i];p.className = dic[i];p.innerHTML = dic2[i] + result[dic[i]];
                }else {
                    p.id = index + '_' + dic[i];p.className = dic[i];p.innerHTML = dic2[i] + trans[result[dic[i]]];
                }
                div.appendChild(p);
            }
            p = document.createElement("button");p.id = index + '_' + 'button';p.className  = "buy-button";
            p.addEventListener('click',function(){
                Post(nowgoods);
                console.log(nowgoods);
            });
            p.innerText = "加入购物车";
            div.appendChild(p);
            let p2 = document.createElement("img");
            p2.src = result["img"];
            p2.className = "item_img";
            div2.appendChild(p2);
            div2.appendChild(div);
            document.getElementById("items").appendChild(div2);
        } else {
            return;
        }
    };
    var requestData = {
        "gid":gid
    };
    // 将数据转换为JSON格式
    var jsonRequestData = JSON.stringify(requestData);
    // 发送请求
    xhr.send(jsonRequestData);
}
