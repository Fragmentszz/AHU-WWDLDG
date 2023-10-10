const http = require('http');
const fs = require('fs');
const db = require('./testdb.js');

const vr = require('./variation.js');
const toSQL = require("./tosql.js");
const exp = require('express');
const session = require('express-session');
const showgoods = require('./show_goods.js');
const server = exp();
const register = require('./register.js');
const login = require('./login.js');
const ShoppingCart = require('./ShoppingCart.js');


const cors = require('cors');

var numcount = vr.numcount;
server.use(session({
    name:'sid',
    secret:'wwdldg',
    saveUninitialized:false,
    resave:true,
    cookie:{
        httpOnly:true,
        maxAge:1000*60*5
    }
}))
server.use(exp.static('./html'));
server.use(showgoods);
server.use(ShoppingCart);
server.get('/',(req,res) => {
    let html1 = fs.readFileSync('./html/newlogin.html');
    res.set('Content-Type', 'text/html; charset=utf-8');
    res.write(html1);
    res.end();
});

/*登陆响应*/
server.use(login);
//注册
server.use(register);

/* 静态与404*/
server.all('*',(req,res) => {
    res.statusCode = 404;
    res.send('404 NOT FOUND');
});
var port = 80;
// var numcount = {"c":0,"s":0,"f":0,"g":0,"o":0};
server.listen(port,() =>{
    let list = ["c","s","f","g","o"];
    let list2 = ["customer","seller","forwarder","goods","orders"];
    console.log("服务启动了>..");
    for(let i=0;i<list.length;i++)
    {
        var sqldic = {...vr.getdic("select",list2[i]),"attribute":["*"],"equal":{}};
        db.dbpool.query(toSQL.toSelect(sqldic),(err,dbres) => {
            if(err){
                console.log(err);
                console.log("连接数据库失败...");
                return;
            }
            numcount[list[i]] = dbres.rowCount;
            console.log(numcount[list[i]]);
        });
    }
})



