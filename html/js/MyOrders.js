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

let gettrans = function()
{
    let url = '/MyOrders';
    let callback = function(xhr){
        var result = JSON.parse(xhr.responseText);
        if(xhr.status === 200){
            deliveryData = result["orders"];
            console.log(deliveryData);
            refresh();
        }else{
            alert(result["describe"]);
            window.parent.postMessage('relogin','*');
        }
    }
    POST(url,{},callback,{});
}

list = ["tsid","toaddress","pay"];
document.addEventListener('DOMContentLoaded',()=>{
    gettrans();
    document.getElementById("completeButton").addEventListener('click',()=>{
        Operation("complete")
    });
    document.getElementById("abandonButton").addEventListener('click',()=>{
        Operation("abandon")
    });
});
var selectedDeliveryId = null;
var selectedDeliveryPay = null;

// 假设以下数据是从服务器获取的递送任务列表
var deliveryData = [];

// 获取用于显示递送任务的表格行的容器元素
var deliveryList = document.getElementById("delivery-list");
var dict = ["未开始运送...","运送中...","已送达目的地"];
function refresh(){
    while (deliveryList.firstChild) {
        deliveryList.removeChild(deliveryList.firstChild);
    }    
    if(deliveryData.length === 0){
        alert("当前没有任何课程申请~");
        return;
    }
// 动态生成递送任务列表的表格行
    deliveryData.forEach(function(delivery) {
    var row = document.createElement("tr");
    var idCell = document.createElement("td");
    var addressCell = document.createElement("td");
    var rewardCell = document.createElement("td");
    var status = document.createElement("td");

    idCell.textContent = delivery.oid;
    addressCell.textContent = delivery.toaddress;
    rewardCell.textContent = delivery.price;
    status.textContent = dict[delivery.status];


    row.appendChild(idCell);
    row.appendChild(addressCell);
    row.appendChild(rewardCell);
    row.appendChild(status);
    
    deliveryList.appendChild(row);
    // 添加点击事件处理程序，用于选中递送单
    row.addEventListener("click", function() {
        if (selectedDeliveryId === delivery.tsid) {
        // 如果已经选中了该递送单，则取消选中
        selectedDeliveryId = null;
        selectedDeliveryPay = null;
        row.classList.remove("selected");
        } else {
        // 否则，选中该递送单
        // 先取消之前选中的递送单
        var selectedRow = document.querySelector(".selected");
        if (selectedRow) {
            selectedRow.classList.remove("selected");
        }
        selectedDeliveryId = delivery.tsid;
        selectedDeliveryPay = delivery.pay;
        row.classList.add("selected");
        }
    });
    });
}
// 提交递送请求
function Operation(action) {
  if (selectedDeliveryId) {
    dic = { "action":action,"tsid":selectedDeliveryId};
    let callback = function(xhr){
        result = JSON.parse(xhr.responseText);
        if(xhr.status === 200){
            alert(result["describe"]);
            gettrans();
        }else{
            alert(result["describe"]);
            window.parent.postMessage('relogin','*');
        }
    };
    POST('/OperateTrans',dic,callback,{});
  } else {
    alert("您还没有选中任何课程申请哦~");
  }
}