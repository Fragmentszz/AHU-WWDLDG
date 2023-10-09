
const server = require('express').Router();
const vr = require('./variation');
const toSQL = require('./tosql');
var numcount = vr.numcount;
const db = require('./testdb.js');
const Tools = require('./Tools.js');

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
module.exports = server;