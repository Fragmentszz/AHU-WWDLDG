const server = require('express').Router();
const db = require('./testdb');
const vr = require('./variation');
const toSQL = require('./tosql');
const TIME = require('./Time');
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
        console.log(sqldic);
        let sql = toSQL.tosql(sqldic);
        console.log(sql,'\n');
        db.dbpool.query(sql,(err,dbres) => {
            if(err){
                console.log(err);
                res.statusCode = 500;
                res.send({"describe":'DataBase ERROR'});
                return;
            }
            if(dbres.rowCount == 0) res.send({"error_code" :1,"uid" : ""});
            else{
                if(dbres.rows[0].pswrd === body.dic["pswrd"]){
                    console.log(dbres.rows[0].uid,body.dic["username"],TIME(),'登陆');
                    req.session.uid = dbres.rows[0].uid;
                    res.send({"error_code" :0,"uid" : dbres.rows[0].uid});
                }else {
                    res.json({"error_code" :2, "uid":dbres.rows[0].uid});
                    res.end();
                }
            }
        });
        
    })
});

module.exports = server;