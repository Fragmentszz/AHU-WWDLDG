
let POST = function(dic)
{
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/ReleaseCourse", false);
    xhr.onload = function() {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            alert(response["describe"]);
        } else if(xhr.status == 500){
            alert("请重新登陆");
            window.parent.postMessage('relogin','*');
        }
    };
    xhr.send(JSON.stringify(dic));
}
list = ['Cname','credit','describe','Ctype','totcount','Croom','Ctime'];

function formatNumber(num) {
    // 将整数转换为字符串，并使用padStart方法在前面补零
    return num.toString().padStart(2, '0');
}
    

document.getElementById("submitbutton").addEventListener('click', function(event) {
    var dic = {'Cname':null,'jid':null,'credit':null,'describe':null,status:null,'totcount':null,'Ctime':null,'Croom':null,'Ctype':null}
    for(let i = 0;i<list.length - 2;i++){
        let value = document.getElementById(list[i]).value;
        if(i != 1)  dic[list[i]] = value;
        else dic[list[i]] = parseFloat(value);
    }
    var room = document.getElementById("Croom_1").value + document.getElementById("Croom_2").value + formatNumber(document.getElementById("Croom_3").value);
    var time = document.getElementById("Ctime_1").value*8192 + parseInt(document.getElementById("Ctime_2").value,2)
    dic["Croom"] = room;
    dic["Ctime"] = time;
    console.log(dic["Croom"]);
    alert(dic.toString());
    POST(dic);
  });