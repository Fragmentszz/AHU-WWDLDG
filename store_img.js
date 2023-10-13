const server = require('express').Router();
const db = require('./testdb');
const vr = require('./variation');
const toSelect = require('./tosql');
const Tools = require('./Tools');


const multer = require('multer');
var path = require("path");


var storage = multer.diskStorage({
    // 配置文件上传后存储的路径
    destination: function (req, file, cb) {

        // NodeJS的两个全局变量
        // console.log(__dirname);  //获取当前文件在服务器上的完整目录 
        // console.log(__filename); //获取当前文件在服务器上的完整路径 
        cb(null, path.join(__dirname, '/html/img/'))
    },
    // 配置文件上传后存储的路径和文件名
    filename: function (req, file, cb) {
        var uid = req.session.uid;
        if(typeof uid === "undefined"){
          return;
        }
        console.log('file', file.originalname);
        const ext = path.extname(file.originalname);
        var imgid = "img" + Tools.toId(vr.numcount["img"] + 1);
        cb(null, imgid + ext);
        vr.numcount["img"] += 1;
    }
});
var upload = multer({ storage: storage });
const middle = (req,res,next) => {
    var uid = req.session.uid;
    if(typeof uid === "undefined"){
      res.status = 500;
      res.send({"describe":"请重新登陆.."});
      return;
    }
    next();
}


server.post('/store_img',middle, upload.single('image'),function (req, res) {
    // 获取上传的文件路径
    const filePath = req.file.filename;
    if(filePath === "" || typeof filePath === "undefined"){
      res.status = 500;
      res.send({"describe":"请重新登陆!"});
    }
    console.log(filePath);
    res.send({"img":"/img/" + filePath});
}
);

module.exports = server;