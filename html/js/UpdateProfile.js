    // 获取表单元素
const form = document.getElementById('profileForm');
const uidInput = document.getElementById('uid');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('pswrd');
const phoneInput = document.getElementById('phone');
const qqInput = document.getElementById('qq');



// 提交表单时的处理函数
form.addEventListener('submit', function(event) {
    event.preventDefault(); // 阻止表单默认提交行为
    // 执行保存用户资料的逻辑
    saveUserProfile();
});
var list = ["uid","username","pswrd","qq","phone"];
var elems = [];
function POST(url,callback,Parms)
{
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, false);
    xhr.onload = function(){
        callback(xhr);
    };
    // 将数据转换为JSON格式
    var jsonRequestData = JSON.stringify(Parms);
    // 发送请求
    xhr.send(jsonRequestData);
}

document.addEventListener('DOMContentLoaded',function(){
    for(let i=0;i<list.length;i++){
        elems.push(document.getElementById(list[i]));
    }
    getUserProfile();
})
function getUserProfile()
{
    let mycallback = function(xhr){
        var result = JSON.parse(xhr.responseText);
        if(xhr.status === 200){
            for(let i=0;i<list.length;i++){
                var elem = elems[i];
                elem.value = result[list[i]];
            }
        }else{
            alert(result["describe"]);
            window.parent.postMessage("relogin","*");
        }
    }
    var params = {};
    POST('/GetProfile',mycallback,params);
}
// 保存用户资料的函数
function saveUserProfile() {
    var params = {};
    for(let i =1;i<list.length;i++){
        params[list[i]] = elems[i].value;
    }    
    let mycallback = function(xhr){
        if(xhr.status != 500){
            var result = JSON.parse(xhr.responseText);
            if(result["status"] === 0){
                alert(result["describe"]);
                getUserProfile();
            }else{
                alert(result["describe"]);
            }
        }else{
            var result = JSON.parse(xhr.responseText);
            alert(result["describe"]);
            window.parent.postMessage("relogin","*");
        }
    }
    POST('/UpdateProfile',mycallback,params);
}