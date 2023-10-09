const { Pool, Client } = require('pg')
// const isMd5 = false
// const client = true

const ogConfig = {
  user: 'tyt',
  database: 'postgres',
  password: 'Tyt123456',
  host: '192.168.43.201',
  port: 5432,
}
const pool = new Pool(ogConfig)
const client = new Client(ogConfig)

var now = Date.now()
client.connect()

client.query('create schema distribute_prepare;', (err, res) => {
  console.log(err, res)
})
client.query('set current_schema = distribute_prepare;', (err, res) => {
  console.log(err, res)
})
client.query('create table prepare_table_01(a int, b numeric) ;', (err, res) => {
  console.log(err, res)
})
client.query('create table prepare_table_02(a int, b int) ;', (err, res) => {
  console.log(err, res)
})
client.query('insert into prepare_table_01 values(1, 1),(1, 1),(1, 1);', (err, res) => {
  console.log(err, res)
})
client.query('insert into prepare_table_02 values(1, 1),(1, 1),(1, 1);', (err, res) => {
  console.log(err, res)
})
client.query('analyze prepare_table_01', (err, res) => {
  console.log(err, res)
})
client.query('analyze prepare_table_02', (err, res) => {
  console.log(err, res)
})
client.query(
  ' prepare p1 as select * from prepare_table_01, prepare_table_02 where prepare_table_01.a = prepare_table_02.a;',
  (err, res) => {
    console.log(err, res)
  }
)
client.query(
  ' prepare p2(int) as select * from prepare_table_01, prepare_table_02 where prepare_table_01.a = prepare_table_02.a and prepare_table_01.b = $1;',
  (err, res) => {
    console.log(err, res)
  }
)
client.query('explain (costs off, verbose on) execute p1;', (err, res) => {
  console.log(err, res)
})
client.query('execute p1;', (err, res) => {
  console.log(err, res)
})
client.query('execute p1;', (err, res) => {
  console.log(err, res)
})
client.query('explain (costs off, verbose on) execute p2(1);', (err, res) => {
  console.log(err, res)
})
client.query('execute p2(1);', (err, res) => {
  console.log(err, res)
})

client.query('execute p2(1);', (err, res) => {
  console.log(err, res)
  client.end()
  console.log('\n\x1b[32mAll queries & client end process complete in \x1b[1m' + (Date.now() - now) + ' ms')
})
