let create = function(id)
{
    var tbody = document.getElementById("tbody");
    var tr = document.createElement('tr');
    
    var td = document.createElement('td');
    id = 3;
    td.innerHTML = `<input type=\"checkbox\" class=\"item-checkbox\" id = "` + id + `\">`
    tr.appendChild(td);
    tbody.appendChild(tr);
}
document.getElementById("create").addEventListener("click",create);

