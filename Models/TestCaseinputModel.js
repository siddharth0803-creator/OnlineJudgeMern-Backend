const mongoose=require('mongoose')

const TestCaseinputModel= mongoose.Schema(
    {
        TestCaseId:{type:Number,required:true},
        TestCaseName:{type:String,required:true},
        input:{type:String,required:true},
    },
    {
        timestamp:true
    }
)

const TestCaseinput=mongoose.model("TestCaseinput",TestCaseinputModel)
module.exports=TestCaseinput