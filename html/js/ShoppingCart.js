document.addEventListener("DOMContentLoaded", function() {
    getGids();
});

var gids = [];
let tot = 0;
var template = {"gid":"","delete":0,"num":0,"enable":0};
let refreshtot = function()
{
    tot = 0;
    for(let i = 0;i<gids.length;i++){
        if(enable[i]){
            tot += totcost[i];
        }
    }
    document.getElementById('total-price').textContent = tot.toFixed(2);
    console.log(tot);
}
let updateShoppingCarts = function(req,id)
{
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/update_og", false);
    xhr.onload = function() {
        if(xhr.status == 200){
            var response = JSON.parse(xhr.responseText);
            num[id] = req["num"];
            totcost[id] = price[id] * num[id];
            document.getElementById("quantity_" + id).innerText = num[id];
            if(req["delete"]){
                getGids();
            }else{
                refreshtot();
            }
        }else{
            alert("修改购物车失败...数据库错误!");
        }
    };
    var jsonRequestData = JSON.stringify(req);
    xhr.send(jsonRequestData);
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

    // 删除商品项
    removeButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            var req = template;
            req["delete"] = 1;
            req["gid"] = gids[index];
            updateShoppingCarts(req,index);
        });
    });

    // 商品选择勾选事件
    itemCheckboxes.forEach((checkbox, index) => {
        checkbox.addEventListener('change', function(){
            console.log(this.checked);
            var nowid = index;
            enable[nowid] = this.checked;
            refreshtot();
        }.bind(checkbox));
    });

    // 商品数量增加按钮事件
    incrementButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            var nowid = this.getAttribute("id");
            console.log(num[nowid],maxnum[nowid]);
            if(num[nowid] + 1 > maxnum[nowid]){
                alert("超出物品最大数量！");
                return;
            }
            var req = template;
            req["num"] = num[nowid] + 1;
            req["gid"] = gids[nowid];
            updateShoppingCarts(req,nowid);
        });
    });

    // 商品数量减少按钮事件
    decrementButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            var nowid = this.getAttribute("id");
            console.log(num[nowid],maxnum[nowid]);
            if(num[nowid] < 1){
                alert("物品都没了！");
                return;
            }
            var req = template;
            req["num"] = num[nowid] - 1;
            req["gid"] = gids[nowid];
            updateShoppingCarts(req,nowid);
        });
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
    for (let i = items.length - 1; i >= 0; i--) {
        items[i].parentNode.removeChild(items[i]);
    }
    if (gids.length == 0) {
        alert("没物品啦!!");
        refreshtot();
        return;
    }
    for (let i = 0; i < gids.length; i++) {
        create(i);
    }
    addListener();
    refreshtot();
}

let getGids = function()
{
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/ShoppingCart", false);
    xhr.onload = function() {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            gids = response["gids"];
            num = response["count"];
            totcost = new Array(gids.length);
            maxnum = new Array(gids.length);
            price = new Array(gids.length);
            refresh();
        } else if(xhr.status == 500){
            alert("请重新登陆");
            window.parent.postMessage('relogin','*');
        }
    };
    xhr.send("");
}
let dic = ["gname","price","lab"];
var trans = {"other":"其他","life":"生活用品","study":"学习用品","transport":"交通工具"};
let create = function(id)
{
    var tbody = document.getElementById("tbody");
    var tr = document.createElement('tr');
    tr.className = "cart-item"; tr.id = "item_" + id;
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/select_goods", false);
    xhr.onload = function() {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            var td = document.createElement('td');
            td.innerHTML = "<input type=\"checkbox\" class=\"item-checkbox\">"
            tr.appendChild(td);
            for(let i=0;i<dic.length;i++){
                td = document.createElement('td');
                if(dic[i] != "lab")td.innerText = response[dic[i]];
                else td.innerText = trans[response[dic[i]]];
                td.setAttribute("id",dic[i] + '_' + id);
                tr.appendChild(td);
            }
            td = document.createElement('td');
            td.innerHTML = `<button class="quantity-button decrement-button" id=\"` +  id +`\">-</button>
                                 <span class="quantity" id="` + "quantity_" + id + `">` + num[id] + `</span>
                                 <button class="quantity-button increment-button" id=\"` + id +`\">+</button>
                             `
            tr.appendChild(td);
            td = document.createElement('td');
            td.innerHTML = `<button class="remove-button"  id="` + id + `">删除</button>`;
            tr.appendChild(td);
            tbody.append(tr);
            price[id] = response["price"];
            totcost[id] = num[id] * response["price"];
            maxnum[id] = response["num"];
            enable[id] = 0;
        } else {
            document.getElementById("response").innerHTML = "请求失败，状态码：" + xhr.status;
        }
    };
    var requestData = {
        "gid":gids[id]
    };
    var jsonRequestData = JSON.stringify(requestData);
    xhr.send(jsonRequestData);
}