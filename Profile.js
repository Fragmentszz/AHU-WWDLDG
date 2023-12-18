const server = require('express').Router();
const db = require('./testdb');
const vr = require('./variation');
const toSelect = require('./tosql');
const Tools = require('./Tools');

server.post('/GetProfile',(req,res) => {
    var uid = req.session.uid;
    console.log(uid)
    let sqldic = {...vr.getdic("select","registermsg"),"attribute":["*"],"equal":{"uid":uid}};
    var sql = toSelect.tosql(sqldic);
    console.log(sql,'\n');
    var response = vr.response;
    db.dbpool.query(sql,(err,dbres) =>{
        if(err){
            console.log(err);
            res.statusCode = 500;
            response["describe"] = "查询失败";
            res.send(response);
            return;
        }
        //console.log(dbres);
        res.send(dbres["rows"][0]);
    })
});

// server.post('/GetProfile_F',(req,res) => {
//     var uid = req.session.uid;
//     let sqldic = {...vr.getdic("select","profile_f"),"attribute":["*"],"equal":{"uid":uid}};
//     var sql = toSelect.tosql(sqldic);
//     console.log(sql,'\n');
//     var response = vr.response;
//     db.dbpool.query(sql,(err,dbres) =>{
//         if(err){
//             console.log(err);
//             res.statusCode = 500;
//             response["describe"] = "查询失败";
//             res.send(response);
//             return;
//         }
//         //console.log(dbres);
//         res.send(dbres["rows"][0]);
//     })
// });

server.post('/UpdateProfile',(req,res) => {
    var body = {"ori":""};
    req.on('data', chunk=>{
        body.ori += chunk;
    });              //登陆button
    req.on('end',()=>{
        var uid = req.session.uid;
        let sqldic = {...vr.getdic("update","registermsg"),"set":{},"equal":{"uid":uid}};
        sqldic["set"] = JSON.parse(body.ori);
        var sql = toSelect.tosql(sqldic);
        console.log(sql,'\n');
        var response = vr.response;
        db.dbpool.query(sql,(err,dbres) =>{
            if(err){
                if(err["code"] === '23505'){
                    response["status"] = 1;
                    response["describe"] = "用户名重复！！";
                }else{
                    console.log(err);
                    res.statusCode = 500;
                    response["status"] = -1;
                    response["describe"] = "数据库错误...";
                }
                res.send(response);
                return;
            }
            //console.log(dbres);
            response["describe"] = "更改成功喽！！";
            res.send(response);
        })
    });

    
});


module.exports = server;