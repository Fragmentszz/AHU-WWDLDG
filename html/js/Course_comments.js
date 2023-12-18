// 获取 URL 查询字符串参数的函数
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    console.log(name);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// 在页面加载时获取参数并进行处理
document.addEventListener('DOMContentLoaded', function () {
    var cid = getParameterByName('cid');
    window.parent.console.log(cid);
    getComment(cid);
});

let POST = function(url, dic, callback, params) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);  // 使用异步方式
    console.log(dic);
    xhr.onload = function() {
        callback(xhr, params);
    }
    var jsonRequestData = JSON.stringify(dic);
    xhr.send(jsonRequestData);
}

let getComment = function(cid) {
    var dic = {
        "cid": null,
    };
    dic["cid"] = cid;
    //如果课程号为空值,说明出错
    if (cid == null) {
        alert("您没有选中任何课程进行评论查看!!?");
        return;
    }
    let callback = function(xhr, params) {
        var response = JSON.parse(xhr.responseText);
        if (xhr.status === 200) {
            var tableBody = document.getElementById('commentBody');
            //window.parent.console.log(response);
            //如果没有课程或者出错处理
            if (!response || !Array.isArray(response) || response.length < 1) {
                // 清空表格内容
                tableBody.innerHTML = '<tr><td colspan="4">暂无评论。</td></tr>';
                return;
            }
            for(let i =0;i<response.length;i++){
                addComment(response[i])
            }
        } else {
            //如果未登录或者距离上一次操作时间过长,重定向到登陆页面
            alert("请重新登陆");
            window.parent.postMessage('relogin', '*');
        }
    };
    POST("/getComments", dic, callback, {});
}

function getCurrentTime() {
    var now = new Date();
    var formattedTime = now.toISOString().slice(0, 19).replace("T", " ");
    return formattedTime;
}

function addComment(paramdic) {
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
    idCell.innerText =  paramdic.sid;  // 可以使用递增的方式生成唯一ID
    userCell.innerText = paramdic.credit;
    commentCell.innerText = paramdic.describe;
    timeCell.innerText = paramdic.commenttime;

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
