const {Client} = require('pg')
const client = new Client({
    user: 'wwd',
    host: '127.0.0.1',
    database: 'postgres',
    password: 'WWDldg!!!',
    port: 7654,
    ssl: {
        rejectUnauthorized: false
      }
})
client.connect();
