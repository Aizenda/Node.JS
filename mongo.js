const mongo=require("mongodb");
const uri="mongodb+srv://root:root123@cluster0.dlphh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"    
const client=new mongo.MongoClient(uri);
let db=null;
initDB = async()=>{
	await client.connect();
	console.log("連線成功");
    // 後續的資料庫操作

    //操作選擇的資料庫
	let db=client.db("website");
    //決定想操作的集合
	let collection=db.collection("use");
    //新增資料
    /*let result=await collection.insertMany([{
        email:"aaa@aa.com",
        password:"abbbaa",
        level:1
    },{
        email:"bbb@bbb.com",
        password:"bbbb",
        leve:1
    },{
        email:"ccc@ccc.com",
        password:"ccc",
        leve:1
    }]);
    console.log("新增成功",result.insertedIds);*/

    //更新資料(使用updateone更新一筆資料，updatemany更新多筆資料)
    /*let result=await collection.updateOne({
        email:"aaa@aa.com"
    },{
        $set:{email:"abc@aaa.com"}//(用來新增欄位，$unset則是移除欄位)
    });
    //計算符合條件的資料
    console.log("符合的資料數量",result.matchedCount);
    //計算實際更新的資料
    console.log("實際更新的資料數量",result.modifiedCount);*/

    /*新增多筆資料
    let result = await collection.updateMany(
        {$or:[{level:1},{level:3}]},
        {
            $unset:{
                role:"reader"

        }
    }
    );
    //計算符合條件的資料
    console.log("符合的資料數量",result.matchedCount);
    //計算實際更新的資料
    console.log("實際更新的資料數量",result.modifiedCount);*/

    //使用unset移除欄位
    /*let result = await collection.updateMany(
        {$or:[{level:1},{level:3}]},
        {
            $unset:{
                role:"reader"
        }
    }
    );
    //計算符合條件的資料
    console.log("符合的資料數量",result.matchedCount);
    //計算實際更新的資料
    console.log("實際更新的資料數量",result.modifiedCount);*/

    //使用deleteOne刪除一筆資料，deleteMany刪除多筆資料
    /*let result=await collection.deleteOne({
            email:"aaa@aa.com"
    })
    //計算符合條件的資料
    console.log("符合的資料數量",result.deletedCount);*/

    //刪除多筆資料
    /*let result=await collection.deleteMany({
        level:1
    });
    console.log(result.deletedCount);*/
	client.close(); // 關閉資料庫
}
initDB();