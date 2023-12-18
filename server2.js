const http = require('http');
const fs = require('fs');
const db = require('./testdb.js');

const vr = require('./variation.js');
const toSQL = require("./tosql.js");
const exp = require('express');
const session = require('express-session');

const server = exp();


const ReleaseCourse = require('./ReleaseCourse.js');
const verify = require('./verify.js');
const login = require('./login.js');
const show_courses = require('./show_courses.js');
const comments = require('./comments.js');
const MyCourse = require('./MyCourse.js');
const profile = require('./Profile.js');
const { toId } = require('./Tools.js');

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
server.use(exp.static('./html/img'));
server.use(sessionmiddle);


server.get('/',(req,res) => {
    let html1 = fs.readFileSync('./html/newlogin.html');
    res.set('Content-Type', 'text/html; charset=utf-8');
    res.write(html1);
    res.end();
});
server.use(ReleaseCourse);
server.use(verify);
server.use(show_courses);
server.use(MyCourse);
server.use(comments);
server.use(profile);
/*登陆响应*/
server.use(login);
//注册
// server.use(register);

/* 静态与404*/
server.all('*',(req,res) => {
    res.statusCode = 404;
    res.send('404 NOT FOUND');
});
var port = 80;
//var numcount = {"SB":0,"DS":0,"GG":0,"ZX":0,"SJ":0,"TS":0,"T":0};
server.listen(port,() =>{
    let list = ["DS","GG","ZX","SJ","TS"];
    let list2 = ["course_DS","course_GG","course_ZX","course_SJ","course_TS"];
    console.log("服务启动了>..");
    for(let i=0;i<list.length;i++)
    {
        var sqldic = {...vr.getdic("select",list2[i]),"attribute":["*"],"equal":{}};
        sqldic["restriction"] = "\nORDER BY " +  'c' + "id DESC";
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
                console.log(dbres)
                if(list[i] != 'ts') str = dbres["rows"][0]['c' + "id"].slice(2);
                else str = dbres["rows"][0][list[i] + "id"].slice(2);
                numcount[list[i]] = parseInt(str);
            }
            console.log(list2[i],numcount[list[i]]);
        });
    }

    //图片
    // function readnext(i){
    //     fs.readdir('./html/img/',(err,files) => {
    //         if(err){
    //             console.log(err);
    //             return;
    //         }
    //         const filePath ="img" + toId(i);
    //         const match = files.filter(file => file.startsWith(filePath));
    //         if(match.length === 0){
    //             vr.numcount["img"] = i-1;
    //             console.log("img",i-1);
    //             return;
    //         }else{
    //             readnext(i+1);
    //         }
    //     });
    // }
    // readnext(1);
})



