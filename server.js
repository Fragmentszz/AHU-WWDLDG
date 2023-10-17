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
const ReleaseGoods = require('./RealeaseGoods.js');
const store_img = require('./store_img.js');
const Profile = require('./Profile.js');
const cors = require('cors');
const { toId } = require('./Tools.js');
const Forward = require('./Forward.js');

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
let sessionmiddle = function(req,res,next)
{
    if(req.path === '/' || req.path.indexOf('login') != -1 || req.path.indexOf('register') != -1){
        next();
    }else{
        if(typeof req.session.uid === 'undefined'){
            res.statusCode = 500;
            res.send({"status":-2,"describe" :"您未登录或需要重新登陆!"});
        }else{
            next();
        }
    }
}
server.use(exp.static('./html'));
server.use(sessionmiddle);
server.use(showgoods);
server.use(ShoppingCart);
server.use(store_img);
server.use(Profile);
server.use(Forward);
server.get('/',(req,res) => {
    let html1 = fs.readFileSync('./html/newlogin.html');
    res.set('Content-Type', 'text/html; charset=utf-8');
    res.write(html1);
    res.end();
});
server.use(ReleaseGoods);
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
    let list = ["c","s","f","g","o","ts"];
    let list2 = ["customer","seller","forwarder","goods","orders","trans"];
    console.log("服务启动了>..");
    for(let i=0;i<list.length;i++)
    {
        var sqldic = {...vr.getdic("select",list2[i]),"attribute":["*"],"equal":{}};
        sqldic["restriction"] = "\nORDER BY " +  list[i] + "id DESC";
        console.log(toSQL.toSelect(sqldic));
        db.dbpool.query(toSQL.toSelect(sqldic),(err,dbres) => {
            if(err){
                console.log(err);
                console.log("连接数据库失败...");
                return;
            }
            //console.log(dbres["rows"][0]);
            if(typeof dbres["rows"][0] === 'undefined'){
                numcount[list[i]] = 0;
            }
            else   {
                let str = "";
                if(list[i] != 'ts') str = dbres["rows"][0][list[i] + "id"].slice(1);
                else str = dbres["rows"][0][list[i] + "id"].slice(2);
                numcount[list[i]] = parseInt(str);
            }
            console.log(list2[i],numcount[list[i]]);
        });
    }

    //图片
    function readnext(i){
        fs.readdir('./html/img/',(err,files) => {
            if(err){
                console.log(err);
                return;
            }
            const filePath ="img" + toId(i);
            const match = files.filter(file => file.startsWith(filePath));
            if(match.length === 0){
                vr.numcount["img"] = i-1;
                console.log("img",i-1);
                return;
            }else{
                readnext(i+1);
            }
        });
    }
    readnext(1);
})



