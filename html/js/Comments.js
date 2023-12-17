document.addEventListener("DOMContentLoaded", function() {
    Getcids();
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
    console.log(tot);
}



let addListener =  function() {
    const itemCheckboxes = document.querySelectorAll('.item-checkbox');

    itemCheckboxes.forEach((checkbox, index) => {
        checkbox.addEventListener('change', function(){
            if(this.checked === true){
                document.getElementById('commentBox').style.display = 'block';
            }
            console.log(this.checked);
            var nowid = index;
            enable[nowid] = this.checked;
            // 如果当前复选框被选中，取消选择其他所有复选框
            if (this.checked) {
                itemCheckboxes.forEach((otherCheckbox, otherIndex) => {
                    if (otherIndex !== index) {
                        otherCheckbox.checked = false;
                        enable[otherIndex] = false;
                    }
                });
            }
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
function createtd1(tr)
{
    let td = document.createElement('td');
    let button = document.createElement('button');button.className = "quantity-button decrement-button";button.innerText = '-';
    td.appendChild(button);
    button = document.createElement('button');button.className = "quantity-button increment-button";button.innerText = '+';
    td.appendChild(button);
    tr.appendChild(td);
}
let refresh = function() {
    var items = document.getElementsByClassName("cart-item");
    for(let i=items.length - 1;i >= 0;i--){
        items[i].parentElement.removeChild(items[i]);
    }
    
    if (cids.length == 0) {
        alert("没课程啦!!");
        refreshtot();
        return;
    }
    for (let i = 0; i < cids.length; i++) {
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
            maxnum = new Array(cids.length);
            price = new Array(cids.length);
            refresh();
        } else if(xhr.status == 500){
            alert("请重新登陆");
            window.parent.postMessage('relogin','*');
        }
    };
    xhr.send("");
}
let dic = ["cname","credit","ctype","ctime","croom"];


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
            td.innerHTML = "<input type=\"radio\" class=\"item-checkbox\" id = \"" +  "de" + id +"\">";
            tr.appendChild(td);
            for(let i=0;i<dic.length;i++){
                td = document.createElement('td');
                if(dic[i] != "lab")td.innerText = response[dic[i]];
                else td.innerText = trans[response[dic[i]]];
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

function getCurrentTime() {
    var now = new Date();
    var formattedTime = now.toISOString().slice(0, 19).replace("T", " ");
    return formattedTime;
}

let addComment = function()
{
    dic = {
        "cids":cids,
        "credit":0.0,
        "describe":"",
        "commenttime":""
    };
    dic["credit"] = document.getElementById("rating").value
    dic["describe"] = document.getElementById("comment").value
    dic["commenttime"] = getCurrentTime();
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
    POST("/addComment",dic,callback,{});
}
