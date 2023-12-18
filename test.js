
// var date = new Date();
// console.log(date);

function getCurrentTime() {
    var now = new Date();
    var options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        //timeZoneName: 'short'
    };
    var formattedTime = now.toLocaleString('zh-CN', options).replace(/\//g, '-');
    
    return formattedTime;
}
console.log(getCurrentTime());


function getCurrentTime2() {
    var now = new Date();
    var formattedTime = now.toISOString().slice(0, 19).replace("T", " ");
    return formattedTime;
}

console.log(getCurrentTime2());