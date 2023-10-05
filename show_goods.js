const exp = require("express");
const route = exp.Router();
const ejs = require("ejs");
route.get('/goods',(req,res) =>{
    if(req.session.uid){
        res.send(`hello ${req.session.uid}`);
    }else{
        res.send("?")
    }

});

route.post('/show_goods',(req,res) =>{
    
});


module.exports={
    route
}