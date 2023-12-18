document.addEventListener("DOMContentLoaded", function() {
    Getcids();
    const checkoutButton = document.getElementById('checkout-button');
    checkoutButton.addEventListener('click',checkout);
});

var cids = [];
let tot = 0;
var template = {"cid":"","delete":0,"num":0,"enable":0};
let refreshtot = function()
{
    tot = 0;
    var tot2 = 0;
    for(let i = 0;i<cids.length;i++){
        if(enable[i]){
            tot += totcost[i];
        }
        tot2 += totcost[i];
    }
    document.getElementById('total-price').textContent = tot.toFixed(2);
    document.getElementById('total-credit').textContent = tot2.toFixed(2);
    console.log(tot);
}

let addListener =  function() {

    const itemCheckboxes = document.querySelectorAll('.item-checkbox');

    // 商品选择勾选事件
    itemCheckboxes.forEach((checkbox, index) => {
        checkbox.addEventListener('change', function(){
            console.log(this.checked);
            var nowid = index;
            enable[nowid] = this.checked;
            refreshtot();
        }.bind(checkbox));
    });



 };
//document.addEventListener('DOMContentLoaded',addListener);
var num = [];
var maxnum = [];
var totcost = [];
var price = [];
var enable = [];

let refresh = function() {
    var items = document.getElementsByClassName("cart-item");
    for(let i=items.length - 1;i >= 0;i--){
        console.log(i);
        items[i].parentElement.removeChild(items[i]);
    }
    //选课数为0
    if (cids.length == 0) {
        alert("您没选择任何课程啦!!");
        refreshtot();
        return;
    }
    for (let i = 0; i < cids.length; i++) {
        console.log(cids[i]);
        create(i);
    }
    addListener();
    refreshtot();
}

let Getcids = function()
{
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/getMyCourses", false);
    xhr.onload = function() {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            cids = response["cids"];
            totcost = new Array(cids.length);
            price = new Array(cids.length);
            enable = new Array(cids.length);
            refresh();
        } else if(xhr.status == 500){
            alert("请重新登陆");
            window.parent.postMessage('relogin','*');
        }
    };
    xhr.send("");
}

let create = function(id)
{
    var tbody = document.getElementById("tbody");
    var tr = document.createElement('tr');
    tr.className = "cart-item"; tr.id = "item_" + id;
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/select_course", false);
    xhr.onload = function() {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            var td = document.createElement('td');
            td.className = "detd";
            td.innerHTML = "<input type=\"checkbox\" class=\"item-checkbox\" id = \"" +  "de" + id +"\">";
            tr.appendChild(td);
            let dic = ["cname","credit","ctype","ctime","croom"];
            for(let i=0;i<dic.length;i++){
                td = document.createElement('td');
                td.innerText = response[dic[i]];
                td.setAttribute("id",dic[i] + '_' + id);
                tr.appendChild(td);
            }
            tbody.append(tr);
            price[id] = response["credit"];
            totcost[id] = price[id];
            enable[id] = 0;
        } else {
            document.getElementById("response").innerHTML = "请求失败，状态码：" + xhr.status;
        }
    };
    var requestData = {
        "cid":cids[id]
    };
    var jsonRequestData = JSON.stringify(requestData);
    xhr.send(jsonRequestData);
}
let POST = function(url,dic,callback,params)
{
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, false);
    xhr.onload = function()
    {
        callback(xhr,params);
    }
    var jsonRequestData = JSON.stringify(dic);
    xhr.send(jsonRequestData);
}

let checkout = function()
{
    dic = {
        "cids":cids,
        "enable":enable
    };
    var flag = false;
    for(let i=0;i<enable.length;i++){
        if(enable[i]){
            flag = true;
            break;
        }
    }
    //没选中任何课程
    if(flag === false){
        alert("您没选中任何课程哦~");
        return;
    }
    console.log(dic);
    let callback = function(xhr,params){
        var response = JSON.parse(xhr.responseText);
        if(xhr.status === 200){
            //alert(response["describe"]);
            Getcids();
        }else{
            alert("请重新登陆");
            window.parent.postMessage('relogin','*');
        }
    };
    POST("/RejectCourse",dic,callback,{});
}
