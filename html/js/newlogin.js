function login() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    var xhr = new XMLHttpRequest();
    // 指定请求方法、URL和是否异步
    xhr.open("POST", "/login_c", false);
    // 设置请求头（可选）
    //xhr.setRequestHeader("Content-Type", "application/json");
    // 定义请求完成时的回调函数
    xhr.onload = function() {
        if (xhr.status === 200) {
            // 请求成功，处理响应数据
            var response = JSON.parse(xhr.responseText);
            //document.getElementById("response").innerHTML = "响应数据: " + JSON.stringify(response);
            if(response["error_code"] === 1){
                alert("找不到用户");
            }else if(response["error_code"] === 2){
                alert("密码错误！");
            }else{
                
                if(response["uid"][0] === 'c'){
                    var xhr2 = new XMLHttpRequest();
                    xhr2.open("POST","/GetOid",false);
                    xhr2.onload = function(){
                        ;
                    };
                    xhr2.send("");
                    window.location.href = '/home_customers.html';
                }else if(response["uid"][0] === 's'){
                    window.location.href = '/home_sellers.html';
                }
            }
        } else {
            // 请求失败，处理错误
            document.getElementById("response").innerHTML = "请求失败，状态码：" + xhr.status;
        }
    };
    // 构建要发送的数据
    var requestData = {
        "username": username,
        "pswrd" : password
    };
    // 将数据转换为JSON格式
    var jsonRequestData = JSON.stringify(requestData);

    // 发送请求
    xhr.send(jsonRequestData);
}
function register() {
    // Redirect to the registration page (replace with the registration page URL)
    window.location.href = "./Reg.html";
}