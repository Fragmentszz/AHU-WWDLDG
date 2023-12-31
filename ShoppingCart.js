const server = require('express').Router();
const db = require('./testdb');
const vr = require('./variation');
const toSelect = require('./tosql');
const Tools = require('./Tools');

server.post('/GetOid',(req,res) =>{
    dic1 = vr.getdic("select","ShoppingCartOid");
    uid = req.session.uid;
    sqldic = {...dic1,"attribute":["oid"],equal:{"cid":uid}};
    var sql = toSelect.toSelect(sqldic);
    console.log(sql,'\n');
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
            console.log(sql,'\n');
            db.dbpool.query(sql,(err2,dbres2) => {
                if(err2){
                    console.log(err2);
                    res.statusCode = 500;
                    res.send('未知错误...请重新登陆');
                    return;
                }
                req.session.oid = oid;
                vr.numcount["o"] += 1;
                res.send("getOid success");
            });
        }else{
            oid = dbres["rows"][0]["oid"];
            req.session.oid = oid;
            res.send("getOid success");
        }
    });
});


server.post('/ShoppingCart',(req,res) => {
    var uid = req.session.uid;
    var oid = req.session.oid;
    if(!oid){
        res.statusCode = 500;
        res.send('您还未登录');
        return;
    }
    sqldic = {...vr.getdic("select","og"),"attribute":["gid","count"],"equal":{"oid":oid}};
    //console.log(sqldic);
    let sql = toSelect.toSelect(sqldic);
    console.log(sql,'\n');
    db.dbpool.query(sql,(err,dbres) => {
        if(err){
            console.log(err);
            res.statusCode = 500;
            res.send('数据库错误..');
            return;
        }
        let gids = [];
        let cnt = [];
        for(let i=0;i<dbres["rowCount"];i++){
            gids.push(dbres["rows"][i]["gid"]);
            cnt.push(dbres["rows"][i]["count"]);
        }
        res.send({"status":0,"gids":gids,"count":cnt});
    })
});

server.post('/update_og',(req,res) => {
    var oid = req.session.oid;
    if(!oid){
        res.statusCode = 500;
        res.send('您还未登录');
        return;
    }
    body = {ori :"",dic:{}};
    req.on('data', chunk=>{
        body.ori += chunk;
    });   
    req.on('end', () => {
        oridic = JSON.parse(body.ori);
        let sql = "";
        if(oridic["delete"] == 1){
            sqldic = {...vr.getdic("delete","og"),"equal":{"gid":oridic["gid"],"oid":oid}};
            sql = toSelect.tosql(sqldic);
        }else{
            sqldic = {...vr.getdic("update","og"),"set":{"count" : oridic["num"]},"equal":{"gid":oridic["gid"],"oid":oid}};
            //console.log(sqldic);
            sql = toSelect.tosql(sqldic);
            console.log(sql,'\n');
        }
        console.log(sql,'\n');
        db.dbpool.query(sql,(err,dbres) =>{
            if(err){
                console.log(err);
                res.statusCode = 500;
                res.send({"status":-1});
                return;
            }
            //console.log(dbres);
            res.send({"status":0});
        })
    });
});

server.post("/RejectCourse",(req,res) => {
    body = {ori :"",dic:{}};
    req.on('data', chunk=>{
        body.ori += chunk;
    });
    req.on('end',async () =>{
        oridic = JSON.parse(body.ori);
        var hvgoods = 0;
        var {cids,enable} = oridic;
        var sql = "";
        var response = vr.response;
        var hssend = 0;
        var sqldic = {};
        console.log(toSelect.tosql(sqldic),'看这里');
        db.dbpool.query(toSelect.tosql(sqldic));
        for(let i=0;i<gids.length && !hssend;i++){
            if(enable[i]){
                sqldic = {...vr.getdic("select","course"),"attribute":["ctime"],"equal":{"cid":cids[i]}}
                var ctime = await db.asyncQuery(toSelect.tosql(sqldic))["dbres"][0]["ctime"];
                console.log(ctime);
                // let sqldic1 = {...vr.getdic("delete","sc"),"equal":{
                    
                // }}
            }
        };
        res.send({code:"0","decribe":"yes"});
    });
});
module.exports = server;