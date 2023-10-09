const { Pool, Client } = require('pg')
// const isMd5 = false
// const client = true

const ogConfig = {
  user: 'sm3test',
  database: 'postgres',
  password: 'Aa123456',
  host: '10.211.55.22',
  port: 5432,
}
const pool = new Pool(ogConfig)
const client = new Client(ogConfig)

let now = Date.now();
client.connect();

client.query(`CREATE TABLE test
(
    c_customer_sk             integer
);`)
client.query('insert into test values(1111)', (err, res) => {
  console.log(res)
})

client.query('update test set c_customer_sk = 2222', (err, res) => {
  console.log(res)
})
client.query('SELECT * FROM test;', (err, res) => {
  console.log(res)
})
client.query('delete from test where c_customer_sk = 2222', (err, res) => {
  console.log(res)
})
client.query('SELECT * FROM test;', (err, res) => {
  console.log(res)
})
client.query('DROP TABLE test;')
.then(() => {
	client.end()
  console.log("\n\x1b[32mAll queries & client ended process complete in \x1b[1m" + (Date.now() - now) + " ms");
})


function rollback(client) {
  //terminating a client connection will
  //automatically rollback any uncommitted transactions
  //so while it's not technically mandatory to call
  //ROLLBACK it is cleaner and more correct
  return client
    .query('ROLLBACK')
    .then(() => client.end())
    .catch(() => client.end())
}
