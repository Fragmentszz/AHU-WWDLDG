const pg = require('pg');

var config = {
    user:'wwd',
    database:'postgres',
    password:'WWDldg!!!',
    host:'172.19.11.158',
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

sql = "select *\nfrom \"WWDLDG\".customer";
console.log(pool);
pool.query(sql,(err,dbres) => {
    if(err){
        console.log(err);
        return;
    }
 });
// module.exports = {
//     Runsql:Runsql,
//     dbpool:pool
// };