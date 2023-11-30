const exp = require("express");
const server = exp.Router();
const ejs = require("ejs");
const db = require('./testdb');
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
        let sqldic = {...vr.select_g_dic,"attribute":["gid"],"equal":{}};
        if(attr != "null" && attr != "my"){
            sqldic["equal"] = {"lab":attr};
        }
        if(typeof body.dic["sid"] != "undefined"){
            sqldic["equal"]["sid"] = req.session.uid;
        }
        let sql = toSQL.toSelect(sqldic);
        console.log(sql,'\n');
        let result = {"code":0,"gids": new Array()};
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
                result["gids"].push(dbres.rows[i]["gid"]);
            }
            //result["gids"].push(dbres.rows[0]["gid"]);
            //res.contentType = 'application/x-www-form-urlencoded';
            res.send(result);
            console.log(result);
        })
    });
});
server.post('/select_goods',(req,res) => {
    var body = {ori:"",dic:{}};
    req.on('data', chunk=>{
        body.ori += chunk;
    });   
    req.on('end',()=>{
        body.dic = JSON.parse(body.ori);
        let gid = body.dic["gid"];
        let sqldic = {...vr.select_g_dic,"attribute":["\"WWDLDG\".goods.*,qq"],"equal":{"gid":gid,"connection":"\"WWDLDG\".seller.sid = \"WWDLDG\".goods.sid"}};
        sqldic["object"] = "\"WWDLDG\".goods, \"WWDLDG\".seller";
        let sql = toSQL.toSelect(sqldic);
        //console.log(sql,'\n');
        db.dbpool.query(sql,(err,dbres) => {
            if(err){
                console.log(err);
                res.statusCode = 500;
                res.send("no");
                return;
            }
            //console.log(dbres);
            res.send(dbres.rows[0]);
        });
    })
});
server.post('/search_goods_byNames',(req,res) =>{
    var body = {ori:"",dic:{}};
    req.on('data', chunk=>{
        body.ori += chunk;
    });
    req.on('end',() => {
        body.dic = JSON.parse(body.ori);
        var sqldic = {...vr.select_g_dic,"attribute":["gid"],"equal":{}};
        sqldic["object"] = "\"WWDLDG\".goods";
        if(body.dic["lab"] != "null"){
            sqldic["equal"]["lab"] = body.dic["lab"];
        }
        if(body.dic["gname"] != ""){
            sqldic["equal"]["LIKE"] ="\"WWDLDG\".goods.gname" + " LIKE " + "\'%" + body.dic["gname"] + "%\'";
        }
        if(body.dic["restriction"] != ""){
            sqldic["restriction"] = "\nOrder BY price " + body.dic["restriction"];
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
            result = {"gids":[]};
            for(i=0;i<dbres["rows"].length;i++)
            {
                result["gids"].push(dbres.rows[i]["gid"]);
            }
            res.send(result);
        });
    })
});

server.post('/addintoSC',(req,res) => {
    var oid = req.session.oid;
    if(typeof oid === 'undefined'){
        res.send({"status":-1,"describe":"您是个卖家哦~请登录买家账号购买物品~"});
        return;
    }
    body = {ori:""};
    req.on('data', chunk=>{
        body.ori += chunk;
    });
    req.on('end',() =>{
        let oridic = JSON.parse(body.ori);
        gid = oridic["gid"];
        sqldic = {...vr.getdic("insert","og"),"equal":{"oid":oid,"gid":gid,"count":1}};
        var sql = toSQL.tosql(sqldic);
        console.log(sql,'\n');
        db.dbpool.query(sql,(err,dbres) =>{
            if(err){
                console.log(err);
                if(err["code"] === '23505')   res.send({"status":1,"describe":"商品已在购物车中"});
                else{
                    res.send({"status":-2,"describe":"数据库错误.."});
                }
                return;
            }
            res.send({"status":0,"describe":"商品添加成功!"});
        })
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