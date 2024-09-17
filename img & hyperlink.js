//載入Express
const express = require('express');

//cread Application objet
const app=express();

//將靜態檔案名稱對應到http://127.0.0.1:3100檔案名稱
app.use(express.static("public"));

//設定樣板引擎
app.set("view engine", "ejs");

//設定session 
const session=require("express-session");

//設定樣板檔案資料夾位置
app.set("views", "./views");

//讓後端能夠接收POST方法的資料
app.use(express.urlencoded({extended:true}));

//啟動伺服器在測試網址http://127.0.0.1:3100/
app.listen(3100, function (){
    console.log("Sever started");
});
app.get("/",(req,res) =>{
    res.render("home.ejs");
});
//設定路徑，預期要求字串會是城市 =city
app.post("/data",(req,res) =>{
    const name=req.body.city;
    if(name==="台北"){
        let data={pop:300, 城市名稱:name};
        res.render("city.ejs", data);
    }else if(name==="新竹"){
        let data={pop:40, 城市名稱:name};
        res.render("city.ejs", data);
    }else if(name==="台中"){
        let data={pop:100, 城市名稱:name};
        res.render("city.ejs", data);
    }else{
        res.redirect(`https://google.com/search?q=${name}`);
    };
});