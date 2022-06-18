const { spawn } = require("child_process");
const path = require("path");
const { remote } = require("electron");
const jetpack = require("fs-jetpack");

const appDataPath = path.resolve(remote.app.getPath("appData"), "TwilioQuest");

// Create a directory to house our python code validator
const pythonValidatorPath = path.join(appDataPath, "python_validator");
const pythonValidatorCodePath = path.join(pythonValidatorPath, "validate.py");
jetpack.dir(pythonValidatorPath);

// An error wrapper we can assume to have a nice human readable error message
class NiceError extends Error {
    constructor(message) {
      super(message);
      this.name = "NiceError";
    }
  }

  // Helper to double check both the python EXE and code path for validation
async function checkSetup(py, programPath) {
    const programExists = await jetpack.existsAsync(programPath);
    if (!programExists) {
      throw new NiceError(`
        Whoops! This trial asked you to create a file at this location:<br/>
        <em style="display:block;padding:5px;overflow-wrap:break-word;">
        ${programPath}</em>
        However, this file doesn't exist at that location - please write your code
        in this file. If you need to change 
        the location of the code folder, go to the 
        Settings UI ("O" key) and under "Variables", change "TQ_PYTHON_CODE_PATH" 
        to a different folder.
      `);
    }
}

// Execute a Python program at the path provided and capture the output
function executeScript(pythonPath, codePath, args = []) {
    return new Promise(async (resolve, reject) => {
      const process = spawn(pythonPath, [codePath].concat(args));
      let finished = false;
      let bufferedStdout = "";
      let bufferedStderr = "";
  
      process.on("error", (e) => {
        console.log(e);
      });
  
      process.stdout.on("data", (data) => {
        bufferedStdout += `${data}`;
      });
  
      process.stderr.on("data", (data) => {
        bufferedStderr += `${data}`;
      });
  
      process.on("close", async (code) => {
        if (code === 0) {
          resolve(bufferedStdout);
        } else {
            resolve(bufferedStderr);
  
          // Write error file
        //   await writeFile(codePath, "error.txt", args, bufferedStderr);
        //   reject(err);
        }
        finished = true;
      });
  
      setTimeout(() => {
        if (!finished) {
          reject(
            new NiceError(`
            Your script didn't return a response in time - we waited for five
            seconds, but it didn't finish executing in that time.
          `)
          );
        }
      }, 30000);
    });
  }

// Export public interface
module.exports = {
    NiceError,
    checkSetup,
    executeScript
  };