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
var numcount = vr.numcount;
var Sequelize = require("sequelize");
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const sequelize = new Sequelize('postgres', 'wwd', 'WWDldg!!!', {
    host: '127.0.0.1',
    port:7654,
    dialect: 'postgres'/* 选择 'mysql' | 'mariadb' | 'postgres' | 'mssql' 其一 */
  });
  

server.use(exp.static('./html'));

server.use(session({
    name:'sid',
    secret:'wwdldg',
    saveUninitialized:false,
    resave:true,
    //store:  db.dbpool,
    cookie:{
        httpOnly:true,
        maxAge:1000*60*5
    }
}))

server.use(showgoods);

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
server.listen(port,() =>{
    console.log("服务启动了>..");
    var sqldic = {...vr.select_c_dic,"attribute":["*"],"equal":{}};
    db.dbpool.query(toSQL.toSelect(sqldic),(err,dbres) => {
        if(err){
            console.log(err);
            console.log("连接数据库失败...");
            return;
        }
        numcount["c"] = dbres.rowCount;
        console.log(numcount["c"]);
    });
    sqldic = {...vr.select_s_dic,"attribute":["*"],"equal":{}};
    db.dbpool.query(toSQL.toSelect(sqldic),(err,dbres) => {
        if(err){
            console.log(err);
            console.log("连接数据库失败...");
            return;
        }
        numcount["s"] = dbres.rowCount;
        console.log(numcount["s"]);
    });
    sqldic = {...vr.select_f_dic,"attribute":["*"],"equal":{}};
    db.dbpool.query(toSQL.toSelect(sqldic),(err,dbres) => {
        if(err){
            console.log(err);
            console.log("连接数据库失败...");
            return;
        }
        numcount["f"] = dbres.rowCount;
        console.log(numcount["f"]);
    });
    sqldic = {...vr.select_g_dic,"attribute":["*"],"equal":{}};
    db.dbpool.query(toSQL.toSelect(sqldic),(err,dbres) => {
        if(err){
            console.log(err);
            console.log("连接数据库失败...");
            return;
        }
        numcount["g"] = dbres.rowCount;
        console.log(numcount["g"]);
    });
})



