const server = require('express').Router();
const db = require('./testdb');
const vr = require('./variation');
const toSelect = require('./tosql');
const Tools = require('./Tools');

server.post('/ReleaseGoods',(req,res) =>{
    var uid = req.session.uid;
    if(!uid){
        res.statusCode = 500;
        res.send('您还未登录');
        return;
    }
    body = {ori :"",dic:{}};
    req.on('data', chunk=>{
        body.ori += chunk;
    });   
    req.on('end', () => {
        var oridic = JSON.parse(body.ori);
        console.log(oridic);
        var gid = 'g' + Tools.toId(vr.numcount["g"] + 1);
        sqldic = {...vr.getdic("insert","goods"),"equal":{
                "gid":gid,"price":oridic["price"],"num":oridic["count"],"describe":oridic["describe"]
                ,"lab":oridic["lab"],"status":true,"sid":uid,"gname":oridic["gname"],"img":oridic["img"]
            }
        };
        let sql = toSelect.tosql(sqldic);
        console.log(sql);
        db.dbpool.query(sql,(err,dbres) => {
            if(err){
                res.send({"status":-1,"describe":"物品添加失败!"});
                console.log(err);
                return;
            }
            vr.numcount["g"] += 1;
            res.send({"status":0,"describe":"物品上架成功~~"});
        });
    });
})

module.exports = server;