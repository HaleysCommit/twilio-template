const { spawn } = require("child_process");
const path = require("path");
const { remote } = require("electron");
const jetpack = require("fs-jetpack");

// An error wrapper we can assume to have a nice human readable error message
class NiceError extends Error {
    constructor(message) {
      super(message);
      this.name = "NiceError";
    }
  }

function executeScript(pythonPath, codePath, args = []) {
    return new Promise(async (resolve, reject) => {
        const process = spawn(pythonPath, [codePath].concat(args));
        let finished = false;
        let bufferedStdout = "";
        let bufferedStderr = "";

        process.stdout.on('data', function (data) 
        {
            bufferedStdout = data.toString();
            console.log("It worked"); 
        });

        process.stderr.on('data', (data) => {
            bufferedStderr = data.toString();
            console.error("stderr: ", data.toString());
        });

        process.on("close", async (code) => {
            finished = true;

            resolve({
                exitCode: code,
                stdout: bufferedStdout,
                stderr: bufferedStderr,
            });
            // if (code !== 0) {
            //   resolve(bufferedStderr);
            // } else {
            //     //   const err = new NiceError(`
            // //     We tried executing your code, but we encountered an error. In the same
            // //     directory as your script, look for a file called 
            // //     <span class="highlight">error.txt</span>. It will
            // //     contain further details about the error we saw.
            // //   `);
            //     resolve(bufferedStderr)
            // //   err.bufferedStderr = bufferedStderr;
            // //   console.error(bufferedStderr);
      
            //   // Write error file
            //   await writeFile(codePath, "error.txt", args, bufferedStderr);
            //   reject(err);
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
    module.exports = {
        NiceError,
        executeScript,
      };
