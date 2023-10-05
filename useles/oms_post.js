const ORM = require("./orm");

var Waterline = require('waterline');
var md = Waterline.Model({
    identity:'sessions',
    tableName:'sessions',
    schema:false,
    primaryKey:"sid",
    adaper:"postgresql",
    attributes:{
        "sid":{
            type:"string",
        },
        "uid":{
            type:"string"
        }
    }
});
 
var model = Waterline.Collection.extend({
    identity:'sessions',
    tableName:'sessions',
    schema:false,
    primaryKey:"sid",
    attributes:{
        "sid":{
            type:"string",
        },
        "uid":{
            type:"string"
        }
    }
});


ORM.orm.initialize(ORM.config, function(err, models) {
        if(err) {
            console.error('orm initialize failed.', err)
            return;
        }
    }
);
console.log("?");
ORM.orm.registerModel(model);

var fd = md.find();
