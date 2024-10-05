//載入Mongodb,並設定連線
const mongo=require("mongodb");
//建立uri物件
const uri="mongodb+srv://root:root123@cluster0.dlphh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
//建立client物件
const client=new mongo.MongoClient(uri);
//連線資料庫
let db=null;
const initDB = async()=>{
    try{
        await client.connect();
        console.log("Connection successful");
        //將資料庫資料賦值給db,並決定操作的庫
        db=client.db("Message-system");
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

//err function
const err = (res, error) => {
    res.render("err.ejs", {error:error})
};

//建立首頁路由
app.get("/",async(req, res)=>{

    try{
        //建立collection物件，並選擇要操作的集合
        const collection=db.collection("message");

        //取得所有留言資料，並排序(舊-->新)
        const AllMessage=await collection.find({}).sort({time:1});

        //將資料枚舉並放入data中
        let data=[]
        await AllMessage.forEach(message => {
            data.push(message);
        });
        
        //回傳
        res.render("home.ejs", {data:data});
    } catch(err){
        return err(res, "無法取得資料!");
    };
});

//留言功能路由
app.post("/message", async (req, res) => {

    try{
        // 建立collection物件，並選擇要操作的集合
        const collection = db.collection("message");

        // 從body中獲取使用者名稱及留言

        // 去除開頭和結尾的空白防止使用者輸入空白
        const name = req.body.name.trim();
        const message = req.body.message.trim(); 

        // 檢查是否為空字串
        if (!name || !message) {
            return err(res, "姓名或留言不能為空!")
        } else {
            // 將資料放入資料庫
            let result = await collection.insertOne({
                name: name,
                message: message,
                time: new Date()
            });

            // 邏輯結束導回首頁
            res.redirect("/");};
        } catch(err){
            return err(res, "留言失敗!");
        };
});

//err路由(避免有人太閒，想看錯誤頁面)
app.get("/error",(req, res) => {
    return err(res, "你很閒喔!!")
});

//伺服器啟動
app.listen(3000, ()=>{
    console.log("Server Started")
});
