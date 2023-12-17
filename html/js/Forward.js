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
    let url = '/getCourse_ds';
    let callback = function(xhr){
        var result = JSON.parse(xhr.responseText);
        if(xhr.status === 200){
            courseData = result["courses"];
            console.log(courseData);
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
});
var selectedDeliveryId = null;
var selectedDeliverytype = null;
// 假设以下数据是从服务器获取的递送任务列表
var courseData = [];

// 获取用于显示递送任务的表格行的容器元素
var deliveryList = document.getElementById("delivery-list");

function refresh(){
    while (deliveryList.firstChild) {
        deliveryList.removeChild(deliveryList.firstChild);
    }    
    if(courseData.length === 0){
        alert("当前没有课程申请记录~");
        return;
    }
// 动态生成递送任务列表的表格行
    courseData.forEach(function(delivery) {
    var row = document.createElement("tr");
    var nameCell = document.createElement("td");
    var teacherCell = document.createElement("td");
    var classroomCell = document.createElement("td");
    var timeCell = document.createElement("td");
    var totcountCell = document.createElement("td");


    nameCell.textContent = delivery.cname;
    teacherCell.textContent = delivery.teacher;
    classroomCell.textContent = delivery.classroom;
    timeCell.textContent = delivery.time;
    totcountCell.textContent = delivery.totcount;
    
    
    row.appendChild(nameCell);
    row.appendChild(teacherCell);
    row.appendChild(classroomCell);
    row.appendChild(timeCell);
    row.appendChild(totcountCell);

    deliveryList.appendChild(row);

    // 添加点击事件处理程序，用于选中递送单
    row.addEventListener("click", function() {
        if (selectedDeliveryId === delivery.cid) {
        // 如果已经选中了该递送单，则取消选中
        selectedDeliveryId = null;
        selectedDeliverytype = null;
        row.classList.remove("selected");
        } else {
        // 否则，选中该递送单
        // 先取消之前选中的递送单
        var selectedRow = document.querySelector(".selected");
        if (selectedRow) {
            selectedRow.classList.remove("selected");
        }
        selectedDeliveryId = delivery.cid;
        selectedDeliverytype = delivery.type;
        row.classList.add("selected");
        }
    });
    });
}

// 提交递送请求
function submitRequest() {
  if (selectedDeliveryId) {
    dic = { "cid":selectedDeliveryId,"ctype":selectedDeliverytype};
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
    POST('/acceptCourses',dic,callback,{});
  } else {
    alert("您还没有选中任何课程哦~");
  }
}