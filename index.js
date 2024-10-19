//載入Mongodb,並設定連線
const mongo=require("mongodb");
//建立uri物件
const uri="mongodb+srv://root:root123@cluster0.dlphh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
//建立client物件
const client=new mongo.MongoClient(uri);
//連線資料庫
let messageDb=null;
let memberDB=null
const initDB = async()=>{
    try{
        await client.connect();
        console.log("Connection successful");
        //將資料庫資料賦值給db,並決定操作的庫
        messageDb=client.db("Message-system");
        memberDB=client.db("member-system");
    } catch(err){
        console.log("Connection failed", err);
    };
};
//調用function連線資料庫
initDB();

//伺服器設定

//載入express，並設定
const express=require("express");
//建立application物件
const app=express();

//session模組設定
const session=require("express-session");
app.use(session({
    secret:"byfuebwyuvbwunijoifew",
    resave:false,
    saveUninitialized:true
}));

//載入EJS模組
const ejs=require("ejs");
//設置樣板引擎
app.set("view engine", "ejs");
//設置路徑
app.set("views", "./views");

//處理靜態檔案
app.use(express.static("public"));

//post請求處理
app.use(express.urlencoded({extended:true}));

//建立首頁路由
app.get("/",(req, res)=>{
    res.redirect("/");
});

//註冊路由
app.post("/signup", async(req, res)=>{

    const name=req.body.name.trim();
    const email=req.body.email.trim();
    const password=req.body.password.trim();
    const collection=memberDB.collection("member");

    try{
        if(!name||!email||!password){
            throw new Error("姓名、信箱、密碼不能為空");
        };

        let result=await collection.findOne({
        email:email
        });

        if(result!==null){
           throw new Error("註冊失敗，信箱重複");
        };

        result=await collection.insertOne({
            name:name,email:email,password:password
        });
        res.redirect("/");
    } catch(error){
        res.redirect(`/error?msg=${error.message}`);
    };

});

//登入路由
app.post("/signin",async(req, res)=>{
    const email=req.body.email;
    const password=req.body.password;
    const collection=memberDB.collection("member")
    let result=await collection.findOne({
        $and:[
            {email:email},
            {password:password}
        ]
    });
    if(result===null){
        res.redirect("/error?msg=登錄失敗，郵件或密碼輸入錯誤");
        return 
    };
    req.session.member=result;
    res.redirect("/member");
});

//留言功能路由
app.post("/message", async (req, res) => {

    try{
        // 建立collection物件，並選擇要操作的集合
        const collection = messageDb.collection("message");

        // 從body中獲取使用者名稱及留言

        // 去除開頭和結尾的空白防止使用者輸入空白
        const name = req.session.member.name.trim();
        const message = req.body.message.trim(); 

        // 檢查是否為空字串
        if (!name || !message) {
            res.redirect("/error?msg=留言不可為空")
        } else {
            // 將資料放入資料庫
            let result = await collection.insertOne({
                name: name,
                message: message,
                time: new Date()
            });

            // 邏輯結束導回首頁
            res.redirect("/member")};
        } catch(err){
            res.redirect("/error?msg=留言失敗");
        };
});

//會員頁面留言顯示
app.get("/member",async(req, res)=>{
    if(!req.session.member){
        const home="首頁"
        res.redirect("/");
        return;
    };
    try{
        //建立collection物件，並選擇要操作的集合
        const collection=messageDb.collection("message");

        //取得所有留言資料，並排序(舊-->新)
        const AllMessage=await collection.find({}).sort({time:1});

        //將資料枚舉並放入data中
        let data=[]
        await AllMessage.forEach(message => {
            data.push(message);
        });
        
        //回傳
        res.render("Message.ejs", {
            name:req.session.member.name,
            data:data});
    } catch(err){
        res.redirect("/error?msg=無法取得資料")
    };
});

//登出路由
app.get("/signout", (req, res)=>{
    
    req.session.member=null;
    res.redirect("/")
});

//err路由
app.get("/error",(req, res) => {
    if (!req.session.member) {
        const msg=req.query.msg;
        const home="首頁"
        return res.render("err.ejs", {error:msg, home:home});
    }else{
        const msg=req.query.msg;
        const home="會員頁"
        res.render("err.ejs", {error: msg, home: home});
    };
    
});

//伺服器啟動
app.listen(3000, ()=>{
    console.log("Server Started")
});
