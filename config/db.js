const mongoose=require('mongoose')

mongoose.set("strictQuery", false);
const connectDB = async()=>{
    try{
        const conn=await mongoose.connect(process.env.MONGOURL,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
        })
        console.log(`mongoDB Connected : ${conn.connection.host}`)
    }catch(error){
        console.log(error)
        process.exit()
    }
}

module.exports=connectDB