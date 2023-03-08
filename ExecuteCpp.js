const {  exec,spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const { stderr } = require("process");

const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const executeCpp = (filepath,input) => {
  const jobId = path.basename(filepath).split(".")[0];
  const outPath = path.join(outputPath, `${jobId}.exe`);

  return new Promise((resolve, reject) => {

let output=""
const cppProcess = spawn('g++', [filepath, '-o', outPath]);
cppProcess.stdout.on('data', (data) => {
  //console.log(`stdout: ${data}`);
  output+=data
});

cppProcess.stderr.on('data', (data) => {
  //console.log(`stderr: ${data}`);
  const errorMessage = data.toString('utf8');
  const errorRegex = /error: (.+)/;
  const match = errorMessage.match(errorRegex);
  const error = match ? match[1] : errorMessage;
  reject(error);
});

cppProcess.on('close', (code) => {
  //console.log(`child process exited with code ${code}`);
  if(code === 0){
      const execProcess = spawn(outPath);
      execProcess.stdout.on('data', (data) => {
         //console.log(`stdout: ${data}`);
         output+=data
      });
      execProcess.stdin.write(input);
      execProcess.stdin.end();
      execProcess.on('close', (code) => {
        if (code === 0) {
          resolve(output);
        } else {
          reject(`Execution failed with code ${code}`);
        }
      });
  }else{
    reject(`Error executing the binary file. Exit code: ${code}`)
  }
});


  });
};

module.exports = {
  executeCpp,
};