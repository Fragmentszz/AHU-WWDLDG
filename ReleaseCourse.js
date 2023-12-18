const server = require('express').Router();
const db = require('./testdb');
const vr = require('./variation');
const toSelect = require('./tosql');
const Tools = require('./Tools');

server.post('/ReleaseCourse',(req,res) =>{
    body = {ori :"",dic:{}};
    req.on('data', chunk=>{
        body.ori += chunk;
    });
    //初始化过程开始
    var Time = null;
    var Room = null;
    var Time_room = null;
    req.on('end', () => {
        
        //读入申请课程信息
        var oridic = JSON.parse(body.ori);          
        //获取申请开的时间，只有后13位才是状态字
        Time = oridic["Ctime"]  % 8192
        //获取申请开课的教室
        Room = oridic["Croom"];
        //读入教师ID
        uid = req.session.uid;          
        var sqldic_room = {...vr.getdic("select","classroom"),attribute:["*"],"equal":{
            "cid":oridic["Croom"] + '_' + (Math.floor(oridic["Ctime"] / 8192)).toString()     //获取一周中的哪一天
        }};
        let sql_room = toSelect.tosql(sqldic_room);
        //  查询对应教室的时间关键字                                                    
        db.dbpool.query(sql_room,(err,dbres) => {   
            if(err || dbres["rows"].length < 1){
                res.send({"status":-1,"describe":"没有这间教室的信息!!"});        //查不到这个教室的信息，返回出错信息
                console.log(err);
                return;
            }
            //教室的时间关键字
            Time_room = dbres["rows"][0]["timestatus"];
            //判断时间不冲突

            //被占用了，返回错误信息
            if((Time_room & Time) > 0){
                res.send({"status":-2,"describe":"时间冲突!!"});
                return;
            }else{                                                     //否则插入进审核表
                oridic["jid"] = uid;
                oridic["status"] = 0;
                //更新数据库课程表的CID,Status
                var DSid = 'DS' +  Tools.toId(vr.numcount["DS"] + 1);                                                         //插入审核表，交由
                let sqldic_insert = {...vr.getdic("insert","Course"),"equal":{
                    "cid":DSid,...oridic
                }};
                let sql_insert = toSelect.tosql(sqldic_insert);
                db.dbpool.query(sql_insert,(err,dbres) =>{                //整合信息，插进审核表中，等待管理员审核
                    if(err){
                        res.send({"status":-1,"describe":"数据库错误.."});
                        console.log(err);
                        return;
                    }
                
                    vr.numcount["DS"] = vr.numcount["DS"] + 1;              
                    //反馈初步审核结果
                    res.send({"status":0,"describe":"已向管理员提交开课申请!"});
                })
            }
        });
    });
})

module.exports = server;