
// 获取 URL 查询字符串参数的函数
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// 在页面加载时获取参数并进行处理
document.addEventListener('DOMContentLoaded', function () {
    var cid = getParameterByName('cid');
});


function getCurrentTime() {
    var now = new Date();
    var formattedTime = now.toISOString().slice(0, 19).replace("T", " ");
    return formattedTime;
}

function addComment() {
    // 获取表格和表体元素
    var table = document.getElementById('commentTable');
    var tbody = document.getElementById('commentBody');

    // 创建新的行和单元格
    var newRow = document.createElement('tr');
    var idCell = document.createElement('td');
    var userCell = document.createElement('td');
    var commentCell = document.createElement('td');
    var timeCell = document.createElement('td');

    // 设置新行的内容
    idCell.innerText = '3';  // 可以使用递增的方式生成唯一ID
    userCell.innerText = '新用户';
    commentCell.innerText = '这是新的评论。';
    timeCell.innerText = getCurrentTime();

    // 将单元格添加到新行中
    newRow.appendChild(idCell);
    newRow.appendChild(userCell);
    newRow.appendChild(commentCell);
    newRow.appendChild(timeCell);

    // 将新行添加到表体中
    tbody.appendChild(newRow);
}


function create(nowgoods)
{
    var xhr = new XMLHttpRequest();
    let cid = cids[nowgoods];
    xhr.open("POST", "/select_course", false);
    xhr.onload = function() {
        if (xhr.status === 200) {
            
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
