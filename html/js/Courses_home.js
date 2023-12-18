var nowid = 0;
var cids = [];
var over = 0;
let dic = ["cname","tname","credit","describe","totcount","ctime","croom","ctype"];
let dic2 = ["课程名称:","上课教师:","学分数:","课程简介:","总学时数:","上课时间:","上课教室:","类别:"];
let trans = {"other":"专业核心课","life":"公共基础课","study":"通识选修课","transport":"实践教育课"};
var nowlab = "null";
let exit = function(xhr)
{
    var result = JSON.parse(xhr.responseText);
    alert(result["describe"]);
    window.parent.postMessage('relogin','*');
}
function refresh()
{
    var items = document.getElementsByClassName("item");
    while (items.length > 0) {
        items[0].parentNode.removeChild(items[0]);
    }
    for(let i = 0; i < 5 && nowid < cids.length; i++) {
        create(nowid);
        nowid++;
    }
}
document.addEventListener("DOMContentLoaded", function() {
    getcids(document.getElementById("allgoods"));
    document.getElementById("searchbutton").addEventListener("click",searchItems);
});

window.onscroll = function() {
        // 判断是否滚动到页面底部
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
            // 滚动到页面底部时执行的代码
            if(nowid < cids.length && !over){
                create(nowid);
                nowid++;
            }
            else if(!over){
                // 滚动已经到底,说明没有其他课程了
                alert("到底了");
                over = 1;
            }
        }
};

function getcids(button)
{
    let attr = button.getAttribute("attr");
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/show_goods", false);
    xhr.onload = function() {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            cids = response["cids"];
            console.log(cids);
            nowlab = attr;
            nowid = 0;
            refresh();
            over = 0;
        } else {
            exit(xhr);
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
    xhr.open("POST", "/search_course_byNames", false);
    xhr.onload = function() {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            cids = response["cids"];
            console.log(cids);
            // console.log(cids.length);
            nowid = 0;
            refresh();
            over = 0;
        } else {
            exit(xhr);
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
        "cid":cids[id]
    };
    // 将数据转换为JSON格式
    var jsonRequestData = JSON.stringify(requestData);
    // 发送请求
    xhr.send(jsonRequestData);
}



function create(nowgoods)
{
    // if(nowgoods >= cids.length){nowgoods--;}
    var xhr = new XMLHttpRequest();
    let cid = cids[nowgoods];
    xhr.open("POST", "/select_course", false);
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
            p.innerHTML = "课程名称:" + result["cname"];
            div.appendChild(p);
            for(i=1;i<dic.length;i++)
            {
                p = document.createElement('p');
                p.id = index + '_' + dic[i];p.className = dic[i];p.innerHTML = dic2[i] + result[dic[i]];
                div.appendChild(p);
            }
            p = document.createElement("button");p.id = index + '_' + 'button';p.className  = "buy-button";
            p.addEventListener('click',function(){
                Post(nowgoods);
            });
            p.innerText = "选课";
            div.appendChild(p);
            // let p2 = document.createElement("img");
            // p2.src = result["img"];
            // p2.className = "item_img";
            // div2.appendChild(p2);
            var iframe = document.createElement('iframe');
            iframe.src = '/Course_comments.html?' + 'cid=' + cids[nowgoods];
            iframe.width = '600';
            iframe.height = '400';
            iframe.frameBorder = '0';
            div2.appendChild(iframe);
            div2.appendChild(div);
            document.getElementById("items").appendChild(div2);
        } else {
            exit(xhr);
        }
    };
    var requestData = {
        "cid":cid
    };
    // 将数据转换为JSON格式
    var jsonRequestData = JSON.stringify(requestData);
    // 发送请求
    xhr.send(jsonRequestData);
}


function searchItems() 
{
    const searchInput = document.getElementById('search-input').value;
    const order = document.getElementById('sort-select').value;
    let sqldic = {"ctype":nowlab,"cname":"","restriction":""};
    if(searchInput != ""){
        sqldic["cname"] = searchInput;
    }
    if(order != 'random'){
        sqldic["restriction"] = order;
    }
    search_goods(sqldic);
}