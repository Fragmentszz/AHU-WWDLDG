
const wtl_pst = require('sails-postgresql');


var adapters = {
    "postgresql":wtl_pst,
    default: "postgresql"
};

var connections = {
    postgresql:{
        adapter: "postgresql",
        url : "postgres://wwd:WWDldg!!!@127.0.0.1:7654/postgres"
    }
};


var config = {
    user:'wwd',
    database:'postgres',
    password:'WWDldg!!!',
    host:'127.0.0.1',
    port:'7654'
};

/**
  * 演示 waterline 的使用
  */
 var Waterline = require('waterline');
 

var User = Waterline.Collection.extend({
     identity: 'sessionz',  //模型名，如果没有设置 tableName 属性，那么waterline默认将模型名设置为表名
     tableName: 'sessionz',//指定表名
     connection: 'postgresql',//指定数据库连接
     // 是否强制模式
     schema: false,
     attributes: {
        "sid":{
            type:"varchar(50)",
            primaryKey:true,
            unique:true
        }
    }
 });
var orm = new Waterline();

// 加载数据集合
orm.registerModel(User);

var config = {
    adapters: adapters,
    datastores: connections
}

//初始化
orm.initialize(config, function(err, models) {
if(err) {
  console.error('orm initialize failed.', err)
  return;
}

// console.log('models:', models);
var message = {
  username: 'tianzi',
  password: '654321',
  birthday:'1995-02-03',
  // address: 'shenzhen'
};

//创建
models.collections.user.create(message, function(err, user) {
  if(err) {
    console.log('err is :\n',err);
  }
  else {
    console.log('creat success :\n',user);
  }
});
});