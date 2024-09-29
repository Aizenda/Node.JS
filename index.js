//資料庫連線
const mongo=require("mongodb");
const uri="mongodb+srv://root:root123@cluster0.dlphh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

//創建client物件
const client=new mongo.MongoClient(uri);
let db=null;

// 連線資料庫
const initDB = async () => {
    try {
        await client.connect();
        console.log("連線成功");
        // 將資料庫實例賦值給全局變數 db
        db = client.db("member-system"); 
    } catch (err) {
        console.log("連線失敗", err);
    }
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

/*建立路由
首頁路由*/
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

//註冊路由
app.post("/signup", async(req,res)=>{
    const name=req.body.name;
    const email=req.body.email;
    const password=req.body.password;

    //檢查資料庫並建立資料
    const collection=db.collection("member");
    let result=await collection.findOne({
        email:email
    });
    if(result!==null){
        res.redirect("/err?msg=註冊失敗，信箱重複");
        return;
    }
    //將新資料放入資料庫
    result= await collection.insertOne({
       name:name ,email:email ,password:password
    });
    //新增成功導回首頁
    res.redirect("/");
})

//登錄路由
app.post("/signin", async(req, res)=>{

    const email=req.body.email;
    const password=req.body.password;

    //檢查資料庫
    const collection=db.collection("member");
    let result=await collection.findOne({
        $and:[
            {email:email},
            {password:password}
        ]
    });
    if(result===null){
        res.redirect("/error?msg=登錄失敗，郵件或密碼輸入錯誤");
        return;
    };
    //登入成功，記錄在session中
    req.session.member=result;
    res.redirect("/member");
});

//登出路由
app.get("/signout",(req, res)=>{
    req.session.member=null;
    res.redirect("/");
    
});


// 伺服器啟動
app.listen(3000, ()=>{
    console.log("Server Started");
});

