const mongoose=require('mongoose')

const TestCaseoutputModel= mongoose.Schema(
    {
        TestCaseId:{type:Number,isrequired:true},
        TestCaseName:{type:String,isrequired:true},
        output:{type:String,isrequired:true},
    },
    {
        timestamp:true
    }
)

const TestCaseoutput=mongoose.model("TestCaseoutput",TestCaseoutputModel)
module.exports=TestCaseoutput