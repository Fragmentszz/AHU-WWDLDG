const exp = require("express");
const server = exp.Router();
const ejs = require("ejs");
const db = require('./testdb.js');
const toSQL = require('./tosql');
const vr = require('./variation');
const { select_g_dic } = require("./variation");
const Tools = require('./Tools');
server.get('/goods',(req,res) =>{
    if(req.session.uid){
        res.redirect('/goods_home.html');
    }else{
        res.redirect('/newlogin.html');
    }
});


server.post('/show_goods',(req,res) =>{
    var body = {ori:"",dic:{}};
    req.on('data', chunk=>{
        body.ori += chunk;
    });         
    req.on('end',()=>{
        body.dic = JSON.parse(body.ori);
        attr = body.dic["attr"];
        let sqldic = {...vr.getdic("select","course_available"),"attribute":["cid"],"equal":{}};
        if(attr != "null" && attr != "my"){
            sqldic["equal"] = {"ctype":attr};
        }
        if(typeof body.dic["sid"] != "undefined"){
            sqldic["equal"]["jid"] = req.session.uid;
        }
        let sql = toSQL.toSelect(sqldic);
        console.log(sql,'\n');
        let result = {"code":0,"cids": new Array()};
        db.dbpool.query(sql,(err,dbres) => {
            if(err){
                console.log(err);
                result.code = -1;
                res.statusCode = 500;
                res.send(result);
                return;
            }
            for(i=0;i<dbres["rows"].length;i++)
            {
                result["cids"].push(dbres.rows[i]["cid"]);
            }
            res.send(result);
        })
    });
});


server.post('/select_course',(req,res) => {
    var body = {ori:"",dic:{}};
    req.on('data', chunk=>{
        body.ori += chunk;
    });   
    req.on('end',()=>{
        body.dic = JSON.parse(body.ori);
        let cid = body.dic["cid"];
        let sqldic = {...vr.getdic("select","course"),"attribute":["\"WWDLDG\".course.*,tname"],"equal":{"cid":cid,"connection":"\"WWDLDG\".teacher.jid = \"WWDLDG\".course.jid"}};
        sqldic["object"] = "\"WWDLDG\".course, \"WWDLDG\".teacher";
        let sql = toSQL.toSelect(sqldic);
        //console.log(sql,'\n');
        db.dbpool.query(sql,(err,dbres) => {
            if(err){
                console.log(err);
                res.statusCode = 500;
                res.send("no");
                return;
            }
            newrow = dbres.rows[0];
            newrow["croom"] = vr.parseClassromm(newrow.croom);
            newrow["ctime"] = vr.parseTimeStatus(newrow.ctime);
            newrow["ctype"] = vr.typelist[(newrow.ctype)];
            res.send(newrow);
        });
    })
});


server.post('/search_course_byNames',(req,res) =>{
    var body = {ori:"",dic:{}};
    req.on('data', chunk=>{
        body.ori += chunk;
    });
    req.on('end',() => {
        body.dic = JSON.parse(body.ori);
        var sqldic = {...vr.getdic("select","course_available"),"attribute":["cid"],"equal":{}};
        if(body.dic["ctype"] != "null"){
            sqldic["equal"]["ctype"] = body.dic["ctype"];
        }
        if(body.dic["cname"] != ""){
            sqldic["equal"]["LIKE"] ="\"WWDLDG\".course_available.cname" + " LIKE " + "\'%" + body.dic["cname"] + "%\'";
        }
        if(body.dic["restriction"] != ""){
            sqldic["restriction"] = "\nOrder BY credit " + body.dic["restriction"];
        }
        let sql = toSQL.toSelect(sqldic);
        console.log(sql,'\n');
        db.dbpool.query(sql,(err,dbres) => {
            if(err){
                console.log(err);
                res.statusCode = 500;
                res.send("no");
                return;
            }
            result = {"cids":[]};
            for(i=0;i<dbres["rows"].length;i++)
            {
                result["cids"].push(dbres.rows[i]["cid"]);
            }
            res.send(result);
        });
    })
});

server.post('/addintoSC',(req,res) => {
    var sid = req.session.uid;
    if(typeof sid === undefined || sid[0] != 'S') {
        res.send({"status":-1,"describe":"您好像不是一个合法的可以选课的学生!~"});
        return;
    }
    body = {ori:""};
    req.on('data', chunk=>{
        body.ori += chunk;
    });
    req.on('end',async () =>{
        let oridic = JSON.parse(body.ori);
        //接受请求信息
        cid = oridic["cid"];
        //开始查询
        var sqldic = {...vr.getdic("select","course"),"attribute":["*"],"equal":{"cid":cid}};
        var sql = toSQL.tosql(sqldic);
        coursemsg = (await (db.asyncQuery(sql)))["dbres"][0];
        coursetime = coursemsg["ctime"];
        //获取天号
        var weekday = Math.floor(coursetime / 8192);        
        //转换为一天内时间
        coursetime = coursetime % 8192;                    
        console.log(coursemsg)
        timestatus = await db.getStudentTime(sid,weekday);
        console.log(timestatus)
        //判断学生个人时间是否冲突!
        if((coursetime & timestatus) > 0){
            res.send({"status":-2,"describe":"选课时间段已有课！"});
            return;
        }else{
            sqldic = {...vr.getdic("insert","sc"),"equal":{"cid":cid,"sid":sid}};
            sqldic_timechange = {...vr.getdic("update","studenttime"),"set":{"timestatus":timestatus | coursetime},"equal":{
                "sid":sid,"weekday":weekday
            }};
        //插入SC表,选课成功
            sqldic_comments = {...vr.getdic("insert","sccomments"),"equal":{"cid":cid,"sid":sid,"credit":0,"describe":null,"commenttime":null}};
            const {code,dbres} = await db.asyncQuery(toSQL.tosql(sqldic_timechange));
            if(code === 0){
                db.asyncQuery(toSQL.tosql(sqldic));
                db.asyncQuery(toSQL.tosql(sqldic_comments));
                //反馈信息
                res.send({"status":0,"describe":"选课成功!"})
            }else{
                res.send({"status":-1,"describe":"数据库错误!"});
            }
        }
    })
})

server.post('/deleteFromGoods',(req,res) => {
    var sid = req.session.uid;
    if(typeof sid === 'undefined'){
        res.send({"status":-1,"describe":"未登录或者需要重新登陆"});
        return;
    }
    body = {ori:""};
    req.on('data', chunk=>{
        body.ori += chunk;
    });
    req.on('end',() =>{
        let oridic = JSON.parse(body.ori);
        gid = oridic["gid"];
        sqldic = {...vr.getdic("delete","goods"),"equal":{"sid":sid,"gid":gid}};
        //sqldic["restriction"] = "\nCASCADE";
        var sql = toSQL.tosql(sqldic);
        console.log(sql,'\n');
        db.dbpool.query(sql,(err,dbres) =>{
            if(err){
                console.log(err);
                if(err["code"] === '23503')   res.send({"status":1,"describe":"商品已在购物车中，无法下架"});
                else{
                    res.send({"status":-2,"describe":"数据库错误.."});
                }
                return;
            }
            Tools.log(gid + ' 被 ' + sid + ' 下架了');
            res.send({"status":0,"describe":"商品下架成功"});
        })
        //res.send("hi");
    })
})


module.exports= server;