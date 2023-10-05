const exp = require("express");
const server = exp.Router();
const ejs = require("ejs");
const db = require('./testdb');
const toSQL = require('./tosql');
const vr = require('./variation');
const { select_g_dic } = require("./variation");

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
        //console.log(attr);
        let sqldic = {...vr.select_g_dic,"attribute":["gid"],"equal":{}};
        if(attr != "null"){
            sqldic["equal"] = {"lab":attr};
        }
        
        let sql = toSQL.toSelect(sqldic);
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
            res.contentType = 'application/x-www-form-urlencoded';
            res.send(result);
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
        console.log(body.dic);
        let gid = body.dic["gid"];
        let sqldic = {...vr.select_g_dic,"attribute":["*"],"equal":{"gid":gid}};
        let sql = toSQL.toSelect(sqldic);
        //console.log(sql);
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

module.exports= server;