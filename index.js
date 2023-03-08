const express = require("express");
const cors = require("cors");
const dotenv=require('dotenv')
const { generateFile } = require("./generateFile");
const problem=require("./Models/problemModel")
const TestCaseinput=require("./Models/TestCaseinputModel")
const TestCaseoutput=require("./Models/TestCaseoutputModel")
const { executeCpp } = require("./executeCpp");
const connectDB = require("./config/db");

const app = express();
dotenv.config()

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
connectDB()

app.get("/", (req, res) => {
  return res.json({ hello: "world!" });
});


/* adds New Problem */
app.post("/addProblem",async (req,res)=>{
    const {problemName,problemStatement,
    constraint,inputFormat,outputFormat
    }=req.body

    const problemExits=await problem.findOne({problemName})

    if(problemExits){
      res.status(400)
        throw new Error("Problem already Exists")
    }
    let tot_id;
await problem.countDocuments()
  .then(result => {
    tot_id = Number(result);
  });

  let problemId=tot_id+1
    const Problem= await problem.create({
      problemId,
      problemName,
      problemStatement,
      constraint,
      inputFormat,
      outputFormat
    })

    if(Problem){
      res.status(201).json({
        _id:Problem._id,
        problemId:Problem.problemId,
        problemName:Problem.problemName,
        problemStatement:Problem.problemStatement,
        constraint:Problem.constraint,
        inputFormat:Problem.inputFormat,
        outputFormat:Problem.outputFormat
    })
    }else{
      res.status(400)
      throw new Error("Failed to Create the Problem")
  }

})

/////////////////////////////////////////////////

/* Adds TestCases For the Added Problems */

app.post("/addTestcaseinput",async (req,res)=>{
  const {TestCaseName,input}=req.body

  let tot_id;
await TestCaseinput.countDocuments({TestCaseName})
  .then(result => {
    tot_id = Number(result);
  });

  const TestCaseId=tot_id+1
  const inputTestcase= await TestCaseinput.create({
    TestCaseId,
    TestCaseName,
    input
  })

  if(inputTestcase){
    res.status(201).json({
      _id:inputTestcase._id,
      TestCaseId:inputTestcase.TestCaseId,
      TestCaseName:inputTestcase.TestCaseName,
      input:inputTestcase.input
  })
  }else{
    res.status(400)
    throw new Error("Failed To create a Testcase")
  }
})

app.post("/addTestcaseoutput",async (req,res)=>{
  const {TestCaseName,output}=req.body

  let tot_id;
await TestCaseoutput.countDocuments({TestCaseName})
  .then(result => {
    tot_id = Number(result);
  });

  const TestCaseId=tot_id+1
  const outputTestcase= await TestCaseoutput.create({
    TestCaseId,
    TestCaseName,
    output
  })

  if(outputTestcase){
    res.status(201).json({
      _id:outputTestcase._id,
      TestCaseId:outputTestcase.TestCaseId,
      TestCaseName:outputTestcase.TestCaseName,
      output:outputTestcase.output
  })
  }else{
    res.status(400)
    throw new Error("Failed To create a Testcase")
  }
})

////////////////////////////////////////////////


/*Gets The Info of the Problem By its problemId */

app.post("/getinfoById",async (req,res)=>{
  const {problemId}=req.body
  const Problem=await problem.findOne({problemId})
  if(Problem){
    res.status(201).json({
      _id:Problem._id,
      problemId:Problem.problemId,
      problemName:Problem.problemName,
      problemStatement:Problem.problemStatement,
      constraint:Problem.constraint,
      inputFormat:Problem.inputFormat,
      outputFormat:Problem.outputFormat
  })
  }else{
    res.status(400)
    throw new Error("Failed to Fetch Data")
}
})
//////////////////////////////////////////////

/* Getting total Number of Problems in the set */
app.get("/totalProblem", async (req, res) => {
  let tot_id;
  await problem.countDocuments()
    .then(result => {
      tot_id = Number(result);
    });
  if (tot_id) {
    res.status(201).json({total:tot_id})
  } else {
    res.status(400);
    return new Error("Total Numbers Could not be counted");
  }
});

/////////////////////////////////////////

/* Getting The input and output from problemName */

app.post("/getinput",async (req,res)=>{
   const {problemName}=req.body
   const inputs=await TestCaseinput.find({TestCaseName:problemName})
   if(inputs){
    res.status(201).json({
      input:inputs
    })
   }else{
    res.status(400)
    throw new Error("Could not fetch inputs")
   }
})

app.post("/getoutput",async (req,res)=>{
  const {problemName}=req.body
  const outputs=await TestCaseoutput.find({TestCaseName:problemName})
  if(outputs){
   res.status(201).json({
     output:outputs
   })
  }else{
   res.status(400)
   throw new Error("Could not fetch inputs")
  }
})

////////////////////////////////////////////////////


/* Code For running the code */
app.post("/run", async (req, res) => {
  const { language = "cpp", code ,input} = req.body;

  if (code === undefined) {
    return res.status(400).json({ success: false, error: "Empty code body!" });
  }
  try {
    // need to generate a c++ file with content from the request
    const filepath = await generateFile(language, code);
    // we need to run the file and send the response
    const output = await executeCpp(filepath,input);
    return res.json({ filepath, output });
  } catch (err) {
    res.status(500).json({ err });
  }
});
//////////////////////////////////////////////

const PORT= process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Listening on port 5000!`);
});