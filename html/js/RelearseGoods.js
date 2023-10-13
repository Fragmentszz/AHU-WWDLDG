let POST = function(dic)
{

    var formData = new FormData();
    var fileobj  = document.getElementById("image").files[0];
    formData.append('image',fileobj);
    var xhr2 = new XMLHttpRequest();
    xhr2.onload = function() {
        if(xhr2.status === 200){
            var xhr = new XMLHttpRequest();
            var result = (JSON.parse(xhr2.responseText))["img"];
            xhr.open("POST", "/ReleaseGoods", false);
            xhr.onload = function() {
                if (xhr.status === 200) {
                    var response = JSON.parse(xhr.responseText);
                    alert(response["describe"]);
                } else if(xhr.status == 500){
                    alert("请重新登陆");
                    window.parent.postMessage('relogin','*');
                }
            };
            dic["img"] = result;
            xhr.send(JSON.stringify(dic));
        }else{
            alert("请重新登陆");
            window.parent.postMessage('relogin','*');
        }
    };
    xhr2.open("POST", "/store_img", false);
    xhr2.send(formData);
}
list = ['gname','price','describe','lab','count'];

document.getElementById("submitbutton").addEventListener('click', function(event) {
    var dic = {};
    for(let i = 0;i<list.length;i++){
        let value = document.getElementById(list[i]).value;
        if(i != 1)  dic[list[i]] = value;
        else dic[list[i]] = parseFloat(value);
    }
    console.log(dic);
    POST(dic);
  });