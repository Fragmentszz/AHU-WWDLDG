const server = require('express').Router();
const db = require('./testdb');
const vr = require('./variation');
const toSelect = require('./tosql');
const Tools = require('./Tools');

server.post('/getMyCourses',(req,res) => {
    var uid = req.session.uid;
    sqldic = {...vr.getdic("select","sc"),"attribute":["*"],"equal":{"sid":uid}};
    let sql = toSelect.toSelect(sqldic);
    console.log(sql,'\n');
    db.dbpool.query(sql,(err,dbres) => {
        if(err){
            console.log(err);
            res.statusCode = 500;
            res.send('数据库错误..');
            return;
        }
        let cids = [];
        for(let i=0;i<dbres["rowCount"];i++){
            cids.push(dbres["rows"][i]["cid"]);
        }
        res.send({"status":0,"cids":cids});
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
    const sid = req.session.uid;
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
        for(let i=0;i<cids.length;i++){
            if(enable[i]){
                sqldic = {...vr.getdic("select","course"),"attribute":["ctime"],"equal":{"cid":cids[i]}}
                var ctime = (await db.asyncQuery(toSelect.tosql(sqldic)))["dbres"][0]["ctime"];
                var weekday = Math.floor(ctime / 8192);
                ctime = ctime % 8192;
                var mytime = await db.getStudentTime(sid,weekday);
                // console.log(ctime);
                let sqldic1 = {...vr.getdic("delete","sc"),"equal":{"cid":cids[i],"sid":sid}};
                let sqldic2 = {...vr.getdic("update","studenttime"),"set":{"timestatus":mytime ^ ctime},"equal":{"sid":sid,"weekday":weekday}};
                db.asyncQuery(toSelect.tosql(sqldic1));
                db.asyncQuery(toSelect.tosql(sqldic2));
            }
        };
        res.send({code:"0","decribe":"MEIYIICI"});
    });
});
module.exports = server;