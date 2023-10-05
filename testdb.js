const pg = require('pg');

var config = {
    user:'wwd',
    database:'postgres',
    password:'WWDldg!!!',
    host:'127.0.0.1',
    port:'7654'
};

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
        console.log(result);
        sqlrunning.result = result;
    });
    return sqlrunning.result;
}

module.exports = {
    Runsql:Runsql,
    dbpool:pool
};