const mongoose=require('mongoose')

const problemModel= mongoose.Schema(
    {
        problemId:{type:Number,required:true},
        problemName:{type:String,required:true},
        problemStatement:{type:String,required:true},
        constraint:{type:String,required:true},
        inputFormat:{type:String,required:true},
        outputFormat:{type:String,required:true}
    },
    {
        timestamp:true
    }
)

const problem=mongoose.model("problem",problemModel)
module.exports=problem