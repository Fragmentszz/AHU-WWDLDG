const server = require('express').Router();
const db = require('./testdb');
const vr = require('./variation');
const toSelect = require('./tosql');
const Tools = require('./Tools');

server.post('/getUnCommentedCourses',(req,res) => {
    var uid = req.session.uid;
    //添加新的视图
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


server.post('/getnocommentCourses',(req,res) => {
    var uid = req.session.uid;
    sqldic = {...vr.getdic("select","nocomments"),"attribute":["*"],"equal":{"sid":uid}};
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

server.post('/addComment',(req,res) => {
    body = {ori :"",dic:{}};
    req.on('data', chunk=>{
        body.ori += chunk;
    });
    req.on('end', async () => {
        oridic = JSON.parse(body.ori);
        var sid = req.session.uid;              //通过cookie获取学生id
        let sql = "";
        var {cid,credit,describe,commenttime} = oridic;     //获取学生请求信息
        sqldic = {...vr.getdic("update","sccomments"),"set":{"credit":credit,"describe":describe,"commenttime":commenttime},"equal":{"cid":cid,"sid":sid}};
        sql = toSelect.tosql(sqldic);
        sqldic_course = {...vr.getdic("select","sc"),"attribute":[],equal":{"cid":cid,"sid":sid}};          //查询该课程是否被该学生选择
        var {code,coursemsg} = (await db.asyncQuery(toSelect.tosql(sqldic_course)));

        if(code === -1){
            res.send({"status":-1,"describe":"数据库错误!"});   //数据库异常处理
            return;
        }else if(coursemsg.length < 1){                             //未查到该条记录，说明该学生未选该门课
            res.send({"status":-1,"describe":"同学您未选该门课程！"}); 
            return;
        }

        db.dbpool.query(sql,(err,dbres) =>{
            if(err){                                                    //数据库异常处理
                console.log(err);
                res.statusCode = 500;
                res.send({"status":-1,"describe":"数据库错误!"});
                return;
            }
            res.send({"status":0,"describe":"添加评论成功!"});              //成功信息返回
        })
    });
});

server.post("/getComments",(req,res) => {
    body = {ori :"",dic:{}};
    req.on('data', chunk=>{
        body.ori += chunk;
    });
    req.on('end',async () =>{
        oridic = JSON.parse(body.ori);
        var cid = oridic["cid"];
        var sql = "";
        var sqldic = {};
        sqldic = {...vr.getdic("select","coursecomments"),attribute:["*"],"equal":{"cid":cid}};
        console.log(toSelect.tosql(sqldic),'看这里');
        db.dbpool.query(toSelect.tosql(sqldic),(err,dbres) => {
            if(err){
                console.log(err);
                res.status = 500;
                res.send({"code":-1,"describe":"数据库错误!"});
                return;
            }
            let rows = dbres["rows"];
            let resp = [];
            for(let i =0;i<rows.length;i++)
            {
                resp.push(rows[i]);
            }
            res.send(resp);
        });
        
        //res.send({code:"0","decribe":"MEIYIICI"});
    });
});
module.exports = server;