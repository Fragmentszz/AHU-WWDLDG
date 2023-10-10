const server = require('express').Router();
const db = require('./testdb');
const vr = require('./variation');
const toSelect = require('./tosql');
const Tools = require('./Tools');
server.post('/GetOid',(req,res) =>{
    var uid = req.session.uid;
    if(!uid){
        res.statusCode = 500;
        res.send('您还未登录');
        return;
    }
    dic1 = vr.getdic("select","ShoppingCartOid");
    sqldic = {...dic1,"attribute":["oid"],equal:{"cid":uid}};
    var sql = toSelect.toSelect(sqldic);
    console.log(sql);
    db.dbpool.query(sql,(err,dbres) => {
        if(err){
            console.log(err);
            return;
        }
        //console.log(dbres);
        var oid = "";
        if(dbres["rows"].length === 0){
            oid = "o" + Tools.toId(vr.numcount["o"] + 1);
            sqldic = {...vr.getdic("insert","orders"),equal:{
                "oid":oid,
                "cid":uid,
                "price":null,
                "toAddrres":null,
                "otime" :null,
                "satisfy":null
            }};
            sql = toSelect.toInsert(sqldic);
            console.log(sql);
            db.dbpool.query(sql,(err2,dbres2) => {
                if(err2){
                    console.log(err2);
                    return;
                }
            });
            console.log(oid);
            
        }else{
            oid = dbres["rows"][0]["oid"];
        }
        req.session.oid = oid;
        console.log(req.session.oid);
        res.send("getOid success");
    });
    
});

server.get('/ShoppingCarts',(req,res) => {
    var uid = req.session.uid;
    var oid = req.session.oid;
    console.log(oid);
    console.log("getoid");
    res.send("?");
});

module.exports = server;