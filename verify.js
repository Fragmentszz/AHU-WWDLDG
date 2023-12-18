const server = require('express').Router();
const db = require('./testdb');
const vr = require('./variation');
const toSelect = require('./tosql');
const Tools = require('./Tools');
const { response } = require('express');

server.post('/getCourse_ds',(req,res) => {
    sqldic = {...vr.getdic("select","verify_table"),"attribute":["*"],"equal":{}};
    var sql = toSelect.tosql(sqldic);
    console.log(sql,'\n');
    db.dbpool.query(sql,(err,dbres)=>{
        var response = vr.response;
        if(err){
            vr.dberr(err,res);
            return;
        }
        response["courses"] = [];
        for(let i=0;i<dbres["rows"].length;i++){
            newrow = {};
            newrow["cid"] = dbres["rows"][i].cid;
            newrow["cname"] = dbres["rows"][i].cname
            newrow["teacher"] = dbres["rows"][i].tname
            newrow["classroom"] = vr.parseClassromm(dbres["rows"][i].croom)
            newrow["time"] = vr.parseTimeStatus(dbres["rows"][i].ctime);
            newrow["totcount"] = dbres["rows"][i].totcount;
            newrow["type"] = dbres["rows"][i].ctype;
            response["courses"].push(newrow);
        }
        res.send(response);
    });
});
typelist = ["GG","SJ","TS","ZX"];

function queryDatabase(sql) {
    return new Promise((resolve, reject) => {
      pool.query(sql, (err, dbres) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(dbres);
      });
    });
}

server.post('/acceptCourses',(req,res) => {
    body = "";
    req.on('data',chunk => {
        body += chunk;
    });
    req.on('end',() =>{
        oridic = JSON.parse(body);
        var cid0 = oridic["cid"];
        var sqldic = {...vr.getdic("select","verify_table"),"attribute":["*"],"equal":{"cid":cid0}};
        var sql1 = toSelect.tosql(sqldic);
        db.dbpool.query(sql1,(err,dbres)=>{
            if(err || dbres["rows"].length < 1){
                vr.dberr(err,res);
                return;
            }
            var ctype = dbres["rows"][0].ctype;
            var croom = dbres["rows"][0].croom
            var ctime = dbres["rows"][0].ctime
            var cid = typelist[ctype] + Tools.toId(vr.numcount[typelist[ctype]] + 1)
            sqldic = {...vr.getdic("update","course"),"set":{"cid":cid,"status":1},"equal":{"cid":oridic["cid"]}};
            var sql = toSelect.tosql(sqldic);
            db.acceptCourses(res,croom,ctime,sql,typelist[ctype]);
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
        // response["courses"] = [];
        response["trans"] = dbres["rows"];
        // for(let i=0;i<dbres["rows"].length;i++){
        //     dbres["rows"][i]
        // }
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
            sqldic = {...vr.getdic("update","trans"),"set":{"starttime":null,"status":0,"fid":null},"equal":{"tsid":oridic["tsid"]}};
        
        }else{
            sqldic = {...vr.getdic("select","trans_running"),"attribute":["pay"],"equal":{"tsid":oridic["tsid"]}};
            let sql = toSelect.tosql(sqldic);
            console.log(sql,'\n');
            db.dbpool.query(sql,(err,dbres)=>{
                if(err){
                    console.log(err);
                    return;
                }
                pay = dbres["rows"][0]["pay"];
                // sqldic2 = {...vr.getdic("update","Forwarder"),"set":{"FUNCION1":"totcost = totcost + " + pay.toString(),"FUNCION2":"credit = credit + 1"},"equal":{"fid":fid}};
                // console.log(toSelect.tosql(sqldic2),'\n');
                // db.dbpool.query(toSelect.tosql(sqldic2),(err,dbres) =>{
                //     if(err){
                //         console.log(err);
                //         return;
                //     }
                // });
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