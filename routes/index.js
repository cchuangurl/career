//非同步讀取檔案套件
const fs = require('fs');
//const koarouter=require("@koa/router");
//處理文件路徑套件
const path = require('path');
const allRoutes = {};
var koa=require("koa");
const app =new koa;

//設定預設文件路徑,module.filename將會回傳該文件夾中的預設文件index.js
const basename = path.basename(module.filename);
//var router=new koarouter();
//依序讀取目錄中檔案，並且一一引入至同一物件中
fs.readdirSync(__dirname)
    .filter((file) =>
        (file.indexOf('.') !== 0) &&
        (file !== basename) &&
        (file.slice(-3) === '.js'))
    .forEach((file) => {
    	const fileName = file.replace('.js','');
        //console.log("got fileName:"+fileName);
        let route= require('./'+fileName);
        allRoutes[fileName] = route;
    });

//判斷非同步是否完成，完成後放入物件中。

console.log("keys of allRouters:"+Object.keys(allRoutes));
Object.keys(allRoutes).forEach((routeName) => {
    console.log("associate?:"+routeName+";"+allRoutes[routeName].associate);
    if (allRoutes[routeName].associate) {
        allRoutes[routeName].associate(allRoutes);
    }
});

module.exports = allRoutes;