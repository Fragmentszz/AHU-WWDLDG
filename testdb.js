const pg = require('pg');
const vr = require('./variation.js')
const toSelect = require('./tosql')
var config = {
    user:'wwd',
    database:'JWXT',
    password:'WWDldg!!!',
    host:'127.0.0.1',
    port:'7654'
};
console.log(pg.native);
var pool = new pg.Pool(config);

sqlrunning = {
    "result" : ""
};
let Runsql = function(sql) 
{
    pool.query(sql,(err,result) => {
        if(err){
            console.log(err);
            return;
        }
        sqlrunning.result = result;
    });
    return sqlrunning.result;
}


function Query(sql){
    return new Promise((resolve,reject) => {
        console.log(sql)
        pool.query(sql,(err,dbres) =>{
            if(err){
                console.log(err)
                resolve({code:-1,"err":err});
            }else{
                resolve({code:0,"dbres":dbres});
            }
        })
    });
}

async function asyncQuery(sql) {
    try {
        const result = await Query(sql);
        console.log(result);
        return { code: result.code, dbres: result.dbres["rows"] };
    } catch (error) {
        console.error("Error in asyncQuery:", error);
        throw error; // 将错误抛出，使得调用方能够捕获
    }
}


async function getTimeStatus(classroom)
{
    var cid = classroom + '_' + (Math.floor(timestatus / 8192)).toString();
    var sqldic_room = {...vr.getdic("select","classroom"),attribute:["*"],"equal":{"cid":cid}};
    let sql_room = toSelect.tosql(sqldic_room);
    const {code,dbres} = await asyncQuery(sql_room);
    if(code === -1 || dbres.length < 0){                                    //数据库方面错误
        return -1;
    }
    return dbres[0]["timestatus"];
}
async function getStudentTime(sid,weekday)
{
    var sqldic = {...vr.getdic("select","studenttime"),attribute:["*"],"equal":{"sid":sid,"weekday":weekday}};
    let sql = toSelect.tosql(sqldic);
    const {code,dbres} = await asyncQuery(sql)
    console.log(dbres);
    if(code === -1 || dbres.length < 0){                                    //数据库方面错误
        return -1;
    }
    return dbres[0]["timestatus"];
}


async function UpdateTimeStatus(classroom,timestatus) {
    var cid = classroom + '_' + (Math.floor(timestatus / 8192)).toString();
    var ntime = timestatus % 8192;
    var sqldic_room = {...vr.getdic("select","classroom"),attribute:["*"],"equal":{"cid":cid}};
    let sql_room = toSelect.tosql(sqldic_room);
    const {code,dbres} = await asyncQuery(sql_room);
    Time_room = dbres[0]["timestatus"];
    if(ntime & Time_room){
        return -2;
    }
    ntime = ntime | Time_room;
    console.log(ntime);
    console.log(Time_room);
    sqldic = {...vr.getdic("update","classroom"),"set":{"timestatus":ntime},"equal":{"cid":cid}};
    const dbres2 = asyncQuery(toSelect.tosql(sqldic));
    if(dbres2["code"] === -1){
        return -1;
    }else return 1;
}

function acceptCourses(res,croom,ctime,sql_course,ctype) {
    UpdateTimeStatus(croom,ctime).then(result =>{
        const updres = result;
    if(updres == -1){
        vr.send(res,"-1","数据库错误!");
    }else if(updres === -2){
        vr.send(res,"-2","时间冲突!已自动拒绝！");
    }else if(updres == 1){
        pool.query(sql_course,(err,dbres) =>{
            if(err){
                vr.dberr(err,res);
                return;
            }
            vr.send(res,'0',"课程审核通过！");
            vr.numcount[ctype] = vr.numcount[ctype] + 1;
            console.log(dbres);
        });
    }
    })
}




module.exports = {
    Runsql:Runsql,
    dbpool:pool,
    UpdateTimeStatus,
    acceptCourses,
    asyncQuery:asyncQuery,
    getStudentTime
};