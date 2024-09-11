module.exports = (a1,a2) =>{
    if(a1===a2){
        return "相同";
    } else if(a1>a2){
        return "大於";
    } else{
        return "小於";
    };
};