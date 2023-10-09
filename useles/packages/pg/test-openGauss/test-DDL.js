const { Pool, Client } = require('pg')
// const isMd5 = false
// const client = true

const ogConfig = {
  user: 'tyt',
  database: 'postgres',
  password: 'Ttt123456',
  host: '192.168.43.201',
  port: 5432,
}
const client = new Client(ogConfig)
var now = Date.now()
client.connect()

//Supports multi-line SQL statements
//The following contains (tables/views/materialized view/index/serial/cursor/function/trigger)
client.query(
  `create table heap_tbl_a(c1 int, c2 int, c3 int);
            CREATE  VIEW MyView AS SELECT * FROM heap_tbl_a WHERE 1 = 1;
            SELECT * FROM MyView;
            create materialized view mv_materialized_test as select * from heap_tbl_a;
            select * from mv_materialized_test;
            CREATE INDEX c1 ON heap_tbl_a(c1);
            create table tbl_xl (
                id serial,
             name text);
             SELECT * FROM tbl_xl;
             INSERT INTO tbl_xl VALUES(1,'tyt');
             CURSOR cursor1 FOR SELECT * FROM tbl_xl;
             FETCH FORWARD 1 FROM cursor1;
             CLOSE cursor1;

             CREATE FUNCTION auditlogfunc() RETURNS TRIGGER AS $example_table$
             BEGIN
             INSERT INTO heap_tbl_a VALUES(1,2,3);
             RETURN NEW;
                END;
            $example_table$ LANGUAGE plpgsql;

             CREATE TRIGGER trigger AFTER INSERT ON tbl_xl FOR EACH ROW EXECUTE PROCEDURE auditlogfunc();
             INSERT INTO tbl_xl VALUES(1,'tyt');

             DROP INDEX c1;
             DROP materialized view mv_materialized_test;
             DROP VIEW MyView;
             DROP TABLE heap_tbl_a;
             DROP TABLE tbl_xl;
             DROP FUNCTION auditlogfunc;
            `,
  (err, res) => {
    if (err) console.log(err)
    console.log(res)
  }
)

//test-case for synonym and procedure
client.query(
  `CREATE SCHEMA ot;
CREATE TABLE ot.t1(id int, name varchar2(10));
CREATE SYNONYM t1 FOR ot.t1;
SELECT * FROM t1;
INSERT INTO t1 VALUES (1, 'ada'), (2, 'bob');
UPDATE t1 SET t1.name = 'cici' WHERE t1.id = 2;
CREATE SYNONYM v1 FOR ot.v_t1;
CREATE VIEW ot.v_t1 AS SELECT * FROM ot.t1;
SELECT * FROM v1;
CREATE OR REPLACE FUNCTION ot.add(a integer, b integer) RETURNS integer AS $$ SELECT $1 + $2 $$ LANGUAGE sql;
CREATE OR REPLACE FUNCTION ot.add(a decimal(5,2), b decimal(5,2)) RETURNS decimal(5,2) AS $$ SELECT $1 + $2 $$ LANGUAGE sql;
CREATE OR REPLACE SYNONYM add FOR ot.add;
SELECT add(1,2);
SELECT add(1.2,2.3);
CREATE PROCEDURE ot.register(n_id integer, n_name varchar2(10)) SECURITY INVOKER AS BEGIN INSERT INTO ot.t1 VALUES(n_id, n_name);
END;
CREATE SYNONYM register FOR ot.register;

`,
  (err, res) => {
    if (err) console.log(err)
    console.log(res)
  }
)
client.query("CALL register(3,'mia');", (err, res) => {
  if (err) console.log(err)
  console.log(res)
})
client.query(
  `DROP SYNONYM t1;
DROP SYNONYM IF EXISTS v1;
DROP SYNONYM IF EXISTS add;
DROP SYNONYM register;
DROP SCHEMA ot CASCADE;`,
  (err, res) => {
    console.log(err, res)
  }
)

//test-case for type
client.query(
  `CREATE TYPE compfoo AS (f1 int, f2 text);
CREATE TABLE t1_compfoo(a int, b compfoo);
CREATE TABLE t2_compfoo(a int, b compfoo);
INSERT INTO t1_compfoo values(1,(1,'demo'));
INSERT INTO t2_compfoo select * from t1_compfoo;
SELECT (b).f1 FROM t1_compfoo;
SELECT * FROM t1_compfoo t1 join t2_compfoo t2 on (t1.b).f1=(t1.b).f1;
ALTER TYPE compfoo RENAME TO compfoo1;
CREATE USER usr1 PASSWORD 'Tyt123456';
ALTER TYPE compfoo1 OWNER TO usr1;
ALTER TYPE compfoo1 SET SCHEMA usr1;
ALTER TYPE usr1.compfoo1 ADD ATTRIBUTE f3 int;
DROP TYPE usr1.compfoo1 cascade;
DROP TABLE t1_compfoo;
DROP TABLE t2_compfoo;
DROP SCHEMA usr1;
DROP USER usr1;
`,
  (err, res) => {
    if (err) console.log(err)
    console.log(res)
    console.log('\n\x1b[32mAll queries & client end process complete in \x1b[1m' + (Date.now() - now) + ' ms')
    client.end()
  }
)
