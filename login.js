const http = require('http');
const fs = require('fs');
const db = require('./testdb.js');
const Tools = require('./Tools.js');
const vr = require('./variation.js');
const toSQL = require("./tosql.js");
const TIME = require('./Time.js')
const exp = require('express');
const session = require('express-session');
const showgoods = require('./show_goods.js').route;
const server = exp();

var numcount = {"c":0,"s":0,"f":0,"g":0};
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


server.get('/set-cookie',(req,res) => {
    res.cookie("uid","zs");
    res.send("hi");
});

/*登陆响应*/
server.post('/login_c',(req,res) => {
    
    var body = {ori:"",dic:{}};
    req.on('data', chunk=>{
        body.ori += chunk;
    });              //登陆button
    req.on('end',()=>{
        //res.setHeader("Access-Control-Allow-Origin", "*");
        console.log(body.ori);
        body.dic = JSON.parse(body.ori);
        sqldic = {...vr.login_dic,"attribute":["uid","pswrd"],"equal":{"username":body.dic["username"]}};
        let sql = toSQL.toSelect(sqldic);
        console.log(sql);
        db.dbpool.query(sql,(err,dbres) => {
            if(err){
                console.log(err);
                res.statusCode = 500;
                res.send('DataBase ERROR');
                return;
            }
            if(dbres.rowCount == 0) res.send({"error_code" :1,"uid" : ""});
            else{
                if(dbres.rows[0].pswrd === body.dic["pswrd"]){
                    console.log(dbres.rows[0].uid,body.dic["username"],TIME(),'登陆');
                    req.session.uid = dbres.rows[0].uid;
                    res.send({"error_code" :0,"uid" : dbres.rows[0].uid});
                    
                    //res.end();
                }else {
                    res.json({"error_code" :2, "uid":dbres.rows[0].uid});
                    res.end();
                }
            }
        });
        
    })
});


server.post('/register_c',(req,res) => {
    var body = {ori:"",dic:{}};
    req.on('data', chunk=>{
        body.ori += chunk;
    });              //注册
    req.on('end',() => {
        console.log(body.ori);
        body.dic = JSON.parse(body.ori);
        var type = body.dic["accountType"];
        sqldic = {...vr.register_dic,"equal":{"username":body.dic["username"],
                                               "pswrd" : body.dic["pswrd"],
                                               "uid" : type + Tools.toId(numcount[type] + 1),
                                               "qq" : body.dic["qq"],
                                               "phone" : body.dic["phone"]}};
        sql = toSQL.toInsert(sqldic);
        console.log(toSQL.toInsert(sqldic));
        db.dbpool.query(sql,(err,dbres) => {
            if(err){
                console.log(typeof(err));
                console.log(err);
                res.statusCode = 500;
                if(err['code'] === '23505'){
                    res.send({"error_code" : 1,"uid" : ""});
                }else{
                    res.send({"error_code" : -1,"uid" : ""});
                }
                return;
            }else{
                sqldic = toSQL.toRegister(type,body,numcount);
                console.log(numcount);
                sql = toSQL.toInsert(sqldic);
                db.dbpool.query(sql,(err2,dbres2) => {
                    if(err2){
                        console.log(err2);
                        res.statusCode = 500;
                        res.send({"error_code" : -1,"uid" : ""});
                        return;
                    }else{
                    numcount[type] = numcount[type] + 1;
                    console.log("注册成功!!");
                    res.send({"error_code" :0,"uid" :type + Tools.toId(numcount[type]),"cnt":numcount[type]});    
                    }
                });
            }
        });
    });

});
/* 静态与404*/
server.all('*',(req,res) => {
    console.log(req.path);
    fs.readFile('./html' + req.path,(err,text) =>{
        if(err){
            fs.readFile('.' + req.path,(err2,text2)=>{
                if(err2){
                    res.statusCode = 404;
                    res.send('NOT FOUND');
                }else{
                    res.end(text2);
                }
            });
        }else{
            res.end(text);
        }
    });
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



