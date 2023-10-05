

// create database, ensure 'sqlite3' in your package.json
const express = require('express');
const session = require('express-session');
var Sequelize = require("sequelize");
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const sequelize = new Sequelize('postgres', 'wwd', 'WWDldg!!!', {
    host: '127.0.0.1',
    port:7654,
    dialect: 'postgres'/* 选择 'mysql' | 'mariadb' | 'postgres' | 'mssql' 其一 */
  });
  

const app = express();

app.use(session({
    secret: 'your_secret_key',
    store: new SequelizeStore({ db: sequelize }),
    resave: false,
    saveUninitialized: false
}));

// 其他中间件和路由

app.listen(3000, () => {
    console.log('Server started on port 3000');
});
