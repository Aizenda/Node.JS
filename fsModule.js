const fs= require("fs");//調用檔案系統模組(fs)

//寫入檔案
fs.writeFile("./test", "覆蓋重寫", (err)=>{
    if(err){
        console.log("寫入失敗")
    }else{
        console.log("寫入成功")
    };
});

//讀取檔案
fs.readFile("./test", {encoding:"utf-8"}, (err, data)=>{
    if(err){
        console.log("error");
    }else{
        console.log(`讀取成功，資料是${data}`);
    };
});


