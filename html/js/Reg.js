const form = document.getElementById("user-registration-form");

form.addEventListener("submit", function (event) {
    event.preventDefault();
    // 获取用户输入的值
    const accountType = document.getElementById("account-type").value;
    const account = document.getElementById("account").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
    const qq = document.getElementById("qq").value;
    const phone = document.getElementById("phone").value;
    const dic = {"s" : "卖家","c":"买家","f":"配送员"};
    if (accountType && account && password && confirmPassword) {
        if (password === confirmPassword) {
            var xhr = new XMLHttpRequest();
            // 指定请求方法、URL和是否异步
            xhr.open("POST", "/register_c", false);
            // 设置请求头（可选）
            // 定义请求完成时的回调函数
            xhr.onload = function() {
                if (xhr.status === 500) {
                    // 请求成功，处理响应数据
                    var response = JSON.parse(xhr.responseText);
                    //document.getElementById("response").innerHTML = "响应数据: " + JSON.stringify(response);
                    if(response["error_code"] === 1){
                        alert("用户名已存在~");
                    }else{
                        alert("数据库出错了...");
                    }
                }else {
                    var response = JSON.parse(xhr.responseText);
                    var str = "欢迎你，第" + response["cnt"] + "位" + dic[accountType];
                    alert("注册成功" + str);
                    window.location.href = "./"; // 更改为你要跳转的网站URL
                }
            };
            // 构建要发送的数据
            var requestData = {
                "username": account,
                "pswrd" : password,
                "accountType" : accountType,
                "qq" : qq,
                "phone" : phone
            };
            // 将数据转换为JSON格式
            var jsonRequestData = JSON.stringify(requestData);

            // 发送请求
            xhr.send(jsonRequestData);
            // 注册成功，跳转到其他网站
            
        } else {
            alert("确认密码与密码不一致，请重新输入");
        }
    } else {
        alert("请填写完整的注册信息");
    }
});