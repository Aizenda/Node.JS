//資料庫連線
const mongo=require("mongodb");
const uri="mongodb+srv://root:root123@cluster0.dlphh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

//創建client物件
const client=new mongo.MongoClient(uri);
let db=null;

const initDB = async()=>{
    try{
        await client.connect();
        console.log("連線成功");
        db=client.db("member-system");
    }catch(err){
        console.log("連線失敗",err)
    };//異步函式要使用try catch 
    
};

// 調用 initDB 函數來初始化資料庫
initDB();

// 後端伺服器基礎設定
// 載入 express 模組
const express = require("express");
// 建立 application 物件
const app = express();

// 載入 session 模組
const session = require("express-session");
// session 基本設定
app.use(session({
    secret: "nbssvjbosnvjsifps", // 設定金鑰用在加密
    resave: false, // 只有 session 被修改時才會保存
    saveUninitialized: true // 如果為 true，即使 session 沒有被修改也會存儲
}));

// EJS 設定
const ejs = require("ejs");
app.set("view engine", "ejs"); // 設置樣板引擎
app.set("views","./views");//攝氏樣板引擎路徑
app.use(express.static("public")); // 處理靜態檔案
// POST 設定
app.use(express.urlencoded({ extended: true }));

//建立路由
//首頁路由
app.get("/",(req, res) =>{
    res.render("index.ejs");
});
//會員頁面路由
app.get("/member",(req, res)=>{
    res.render("member.ejs");
});
//錯誤頁面

app.get("/error", (req, res)=>{
    const msg=req.query.msg;
    res.render("err.ejs",{msg:msg})
});
// 伺服器啟動
app.listen(3000, ()=>{
    console.log("Server Started");
});