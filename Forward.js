const server = require('express').Router();
const db = require('./testdb');
const vr = require('./variation');
const toSelect = require('./tosql');
const Tools = require('./Tools');


server.post('/getTrans',(req,res) => {
    sqldic = {...vr.getdic("select","trans_available"),"attribute":["*"],"equal":{}};
    var sql = toSelect.tosql(sqldic);
    console.log(sql,'\n');
    db.dbpool.query(sql,(err,dbres)=>{
        response = vr.response;
        if(err){
            vr.dberr(err,res);
            return;
        }
        response["trans"] = dbres["rows"];
        res.send(response);
    });
});

server.post('/acceptTrans',(req,res) => {
    body = "";
    req.on('data',chunk => {
        body += chunk;
    });
    req.on('end',() =>{
        oridic = JSON.parse(body);
        var fid = req.session.uid;
        sqldic = {...vr.getdic("select","forwarder"),"attribute":["credit"],"equal":{"fid":fid}};
        db.dbpool.query(toSelect.tosql(sqldic),(err,dbres1)=>{
            if(err){
                console.log(err);
                vr.dberr();
                return;
            }
            if(dbres1["rows"][0]["credit"] < 1){
                vr.send(res,'1','信誉分不足1分,无法接受任务!');
                return;
            }
            sqldic = {...vr.getdic("update","trans"),"set":{"fid":fid,"starttime":"NOW()","status":1},"equal":{"tsid":oridic["tsid"]}};
            var sql = toSelect.tosql(sqldic);
            console.log(sql);
            db.dbpool.query(sql,(err,dbres) =>{
                response = vr.response;
                if(err){
                    vr.dberr(err,res);
                    return;
                }
                Tools.log("运单" + oridic["tsid"] + "被" + fid + "接受了");
                vr.send(res,'0',"接受任务成功！！");
            });
        });
        
    });
});

server.post('/Mytrans',(req,res) => {
    fid = req.session.uid;
    sqldic = {...vr.getdic("select","trans_running"),"attribute":["*"],"equal":{"fid":fid}};
    var sql = toSelect.tosql(sqldic);
    console.log(sql,'\n');
    db.dbpool.query(sql,(err,dbres)=>{
        response = vr.response;
        if(err){
            vr.dberr(err,res);
            return;
        }
        response["trans"] = dbres["rows"];
        res.send(response);
    });
});

server.post('/MyOrders',(req,res) => {
    cid = req.session.uid;
    sqldic = {...vr.getdic("select","myorders"),"attribute":["*"],"equal":{"cid":cid}};
    var sql = toSelect.tosql(sqldic);
    console.log(sql,'\n');
    db.dbpool.query(sql,(err,dbres)=>{
        response = vr.response;
        if(err){
            vr.dberr(err,res);
            return;
        }
        response["orders"] = dbres["rows"];
        res.send(response);
    });
});


server.post('/OperateTrans',(req,res) => {
    body = "";
    req.on('data',chunk => {
        body += chunk;
    });
    req.on('end',() =>{
        oridic = JSON.parse(body);
        var fid = req.session.uid;
        var pay = 0;
        var sqldic = {};
        var sqldic2 = {};
        if(oridic["action"] === "abandon"){
            sqldic2 = {...vr.getdic("update","Forwarder"),"set":{"FUNCION":"credit = credit - 1"},"equal":{"fid":fid}};
            console.log(toSelect.tosql(sqldic2),'\n');
            db.dbpool.query(toSelect.tosql(sqldic2),(err,dbres) =>{
                if(err){
                    console.log(err);
                    return;
                }
            });
            sqldic = {...vr.getdic("update","trans"),"set":{"starttime":null,"status":0,"fid":null},"equal":{"tsid":oridic["tsid"]}};
        
        }else{
            sqldic = {...vr.getdic("select","trans_running"),"attribute":["pay"],"equal":{"tsid":oridic["tsid"]}};
            console.log(sqldic);
            let sql = toSelect.tosql(sqldic);
            console.log(sql,'\n');
            db.dbpool.query(sql,(err,dbres)=>{
                if(err){
                    console.log(err);
                    return;
                }
                pay = dbres["rows"][0]["pay"];
                console.log(dbres);
                console.log(pay);
                sqldic2 = {...vr.getdic("update","Forwarder"),"set":{"FUNCION1":"totcost = totcost + " + pay.toString(),"FUNCION2":"credit = credit + 1"},"equal":{"fid":fid}};
                console.log(toSelect.tosql(sqldic2),'\n');
                db.dbpool.query(toSelect.tosql(sqldic2),(err,dbres) =>{
                    if(err){
                        console.log(err);
                        return;
                    }
                });
            });
            sqldic = {...vr.getdic("update","trans"),"set":{"endtime":"NOW()","status":2},"equal":{"tsid":oridic["tsid"]}};
            
            }
        //console.log(sqldic)
        var sql = toSelect.tosql(sqldic);
        console.log(sql,'\n');
        db.dbpool.query(sql,(err,dbres) =>{
            response = vr.response;
            if(err){
                vr.dberr(err,res);
                return;
            }
            if(oridic["action"] === "complete") {
                vr.send(res,'0',"任务成功！！报酬增加了" + pay.toString() + "元");
                Tools.log("运单" + oridic["tsid"]  + "被" + fid + "完成了");
            }
            else if(oridic["action"] === "abandon") {
                vr.send(res,'0',"取消任务成功！您的信誉分减少...");
                Tools.log("运单" + oridic["tsid"]  + "被" + fid + "放弃了");
            }
        });
    });
});
module.exports = server;