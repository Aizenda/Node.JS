//載入Express
const express = require('express');

//cread Application objet
const app=express();
//啟動伺服器在測試網址http://127.0.0.1:3000/
app.listen(3000, function (){
    console.log("Sever started");
});//3000為埠號，可由後端控制

//路由設定(Route) 
/*req:全稱Http request代表前端請求；
前端立場:主動發處請求
後端立場:被動接受請求
Express 接受請求的流程
    1.前端發出請求
    2.Express module 協助處理網路連線，並封裝在Request Object
    3.根據路由設定來決定如何處理請求  
Request物件屬性:
    method 請求路徑
    protocol 訊訊協定
    hostname 主機名稱
    path 網址路徑
Request Headers(標頭物件)包當前請求外的附加物件
 *res:代表回應物件
*/
//獲得請求的基本資訊
app.get("/",(req,res) =>{
/*  console.log(req.hostname);
    console.log(req.protocol);
    console.log(req.path);
*/
//取得請請求的標頭
/*  console.log(req.headers);
    console.log(req.get("user-agent"));
    console.log(req.get("accept-language"))
    res.send("Home page");
*/
//依據使用者的偏好語言呈現不同的文字
    const lang=req.get("accept-language");
    if(lang.startsWith==="zh"){
        res.send("Home page");
    }else{
        res.send("首頁")
    };
});
//設定路徑，預期要求字串會是城市 =city
app.get("/data",(req,res) =>{
    const name=req.query.city;
    if(name==="台北"){
        res.send("城市名稱:"+name+"人口數100萬");
    }else if(name==="新竹"){
        res.send("城市名稱:"+name+"人口數70萬");
    }else if(name==="台中"){
        res.send("城市名稱:"+name+"人口數110萬");
    }else{
        res.send("城市名稱:"+name+"樣本不足");
    };
});