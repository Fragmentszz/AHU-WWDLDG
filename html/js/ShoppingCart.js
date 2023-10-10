document.addEventListener('DOMContentLoaded', function() {
    const cartItems = document.querySelectorAll('.cart-item');
    const removeButtons = document.querySelectorAll('.remove-button');
    const totalPriceSpan = document.getElementById('total-price');
    const checkoutButton = document.getElementById('checkout-button');
    const itemCheckboxes = document.querySelectorAll('.item-checkbox');
    const incrementButtons = document.querySelectorAll('.increment-button');
    const decrementButtons = document.querySelectorAll('.decrement-button');
    const quantitySpans = document.querySelectorAll('.quantity');

    let totalPrice = 0;

    // 更新总价
    function updateTotalPrice() {
        totalPrice = 0;
        cartItems.forEach((item, index) => {
            
            if (itemCheckboxes[index].checked) {
                console.log(index);
                const price = parseFloat(item.querySelector('td:nth-child(3)').textContent.replace('￥', ''));
                const quantity = parseInt(quantitySpans[index].textContent);
                totalPrice += price * quantity;
            }
        });
        
        totalPriceSpan.textContent = totalPrice.toFixed(2);
    }
    // 删除商品项
    removeButtons.forEach((button, index) => {
        
        button.addEventListener('click', function() {
            console.log(2);
            const item = button.parentElement.parentElement;
            const tdElements = trElement.querySelectorAll('td');
            console.log(tdElements[0].className);
            item.remove();
            updateTotalPrice();
        });
    });

    // 商品选择勾选事件
    itemCheckboxes.forEach(checkbox => {
        console.log(1);
        checkbox.addEventListener('change', updateTotalPrice);
    });

    // 商品数量增加按钮事件
    incrementButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            const quantity = parseInt(quantitySpans[index].textContent);
            quantitySpans[index].textContent = quantity + 1;
            updateTotalPrice();
        });
    });

    // 商品数量减少按钮事件
    decrementButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            const quantity = parseInt(quantitySpans[index].textContent);
            if (quantity > 1) {
                quantitySpans[index].textContent = quantity - 1;
                updateTotalPrice();
            }
        });
    });

    // 初始化总价
    updateTotalPrice();
});
var nowid = 0;
var gids = [];
// function getOids()
// {
//     var xhr = new XMLHttpRequest();
//     xhr.open("POST", "/getOids", false);
//     xhr.onload = function() {
//         if (xhr.status === 200) {
//             var response = JSON.parse(xhr.responseText);
//             oids = response["oids"];
//             nowlab = attr;
//             nowid = 0;
//             refresh();
//             over = 0;
//         } else {
//             document.getElementById("response").innerHTML = "请求失败，状态码：" + xhr.status;
//         }
//     };
//     // 发送请求
//     xhr.send("");
// }
// function getOrder(oid)
// {

// }

function createtd1(tr)
{
    let td = document.createElement('td');
    let button = document.createElement('button');button.className = "quantity-button decrement-button";button.innerText = '-';
    td.appendChild(button);
    button = document.createElement('button');button.className = "quantity-button increment-button";button.innerText = '+';
    td.appendChild(button);
    tr.appendChild(td);
}


let create = function(id)
{
    // <td><input type="checkbox" class="item-checkbox"></td>
    //                 <td>二手雪碧</td>
    //                 <td>￥2</td>
    //                 <td>
    //                     <button class="quantity-button decrement-button">-</button>
    //                     <span class="quantity">1</span>
    //                     <button class="quantity-button increment-button">+</button>
    //                 </td>
    //                 <td>其他</td>
    //                 <td><button class="remove-button">删除</button></td>
    var tr = document.createElement('tr');
    tr.className = "cart-item"; tr.id = "item_" + nowid;
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/getOrder", false);
    xhr.onload = function() {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            var td = document.createElement('td');
            var input = document.createElement('input');input.type = "checkbox";input.className = "item-checkbox";
            tr.appendChild(td);
        } else {
            document.getElementById("response").innerHTML = "请求失败，状态码：" + xhr.status;
        }
    };
    // var requestData = {
    //     "oid" : oids[id]
    // };
    // // 将数据转换为JSON格式
    // var jsonRequestData = JSON.stringify(requestData);
    // 发送请求
    xhr.send("");
}