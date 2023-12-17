document.addEventListener("DOMContentLoaded", function() {
    getcids();
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
    const cartItems = document.querySelectorAll('.cart-item');
    const removeButtons = document.querySelectorAll('.remove-button');
    const totalPriceSpan = document.getElementById('total-price');
    const checkoutButton = document.getElementById('checkout-button');
    const itemCheckboxes = document.querySelectorAll('.item-checkbox');
    const incrementButtons = document.querySelectorAll('.increment-button');
    const decrementButtons = document.querySelectorAll('.decrement-button');
    const quantitySpans = document.querySelectorAll('.quantity');

    checkoutButton.addEventListener('click',checkout);

    // 删除商品项
    // removeButtons.forEach((button, index) => {
    //     button.addEventListener('click', function() {
    //         var req = template;
    //         req["delete"] = 1;
    //         req["cid"] = cids[index];
    //         updateShoppingCarts(req,index);
    //     });
    // });

    // 商品选择勾选事件
    itemCheckboxes.forEach((checkbox, index) => {
        checkbox.addEventListener('change', function(){
            console.log(this.checked);
            var nowid = index;
            enable[nowid] = this.checked;
            refreshtot();
        }.bind(checkbox));
    });

    // // 商品数量增加按钮事件
    // incrementButtons.forEach((button, index) => {
    //     button.addEventListener('click', function() {
    //         var nowid = this.getAttribute("id");
    //         console.log(num[nowid],maxnum[nowid]);
    //         if(num[nowid] + 1 > maxnum[nowid]){
    //             alert("超出选课最大数量！");
    //             return;
    //         }
    //         var req = template;
    //         req["num"] = num[nowid] + 1;
    //         req["cid"] = cids[nowid];
    //         updateShoppingCarts(req,nowid);
    //     });
    // });

    // // 商品数量减少按钮事件
    // decrementButtons.forEach((button, index) => {
    //     button.addEventListener('click', function() {
    //         var nowid = this.getAttribute("id");
    //         console.log(num[nowid],maxnum[nowid]);
    //         if(num[nowid] < 1){
    //             alert("课程都没了！");
    //             return;
    //         }
    //         var req = template;
    //         req["num"] = num[nowid] - 1;
    //         req["cid"] = cids[nowid];
    //         updateShoppingCarts(req,nowid);
    //     });
    // });

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

let getcids = function()
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
//var trans = {"other":"专业核心课","life":"公共基础课","study":"通识选修课","transport":"实践教育课"};
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

let checkout = function()
{
    dic = {
        "cids":cids,
        "enable":enable
    };
    console.log(dic);
    let callback = function(xhr,params){
        var response = JSON.parse(xhr.responseText);
        if(xhr.status === 200){
            alert(response["describe"]);
            getcids();
        }else{
            alert("请重新登陆");
            window.parent.postMessage('relogin','*');
        }
    };
    POST("/RejectCourse",dic,callback,{});
}
