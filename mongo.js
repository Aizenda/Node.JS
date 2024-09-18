const mongo=require("mongodb");
const uri="mongodb+srv://root:root123@cluster0.dlphh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"    
const client=new mongo.MongoClient(uri);
let db=null;
async function initDB(){
	await client.connect();
	console.log("連線成功");
    // 後續的資料庫操作

    //操作選擇的資料庫
	let db=client.db("website");
    //決定想操作的集合
	let collection=db.collection("use");
    //新增資料
    let result=await collection.insertMany([{
        email:"aaa@aa.com",
        password:"abbbaa",
        level:1
    },{
        email:"bbb@bbb.com",
        password:"bbbb",
        leve:2
    },{
        email:"ccc@ccc.com",
        password:"ccc",
        leve:3
    }]);
    console.log("新增成功",result.insertedIds);
	client.close(); // 關閉資料庫
}
initDB();