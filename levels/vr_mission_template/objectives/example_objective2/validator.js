const path = require("path");
const jetpack = require("fs-jetpack");
const {
  NiceError,
  executeScript,
} = require("../../../../scripts/testValidation");
const { stderr } = require("process");

module.exports = async (helper) => {

    const { programPath } = helper.validationFields;

    if (!programPath) {
      throw new NiceError(`
        Please provide a path to your Python script - e.g. C:\\code\\salutation.py
      `);
    }

    // const [isExecutableValid, errorMessage] = await helper.isExecutableValid(
    //   programPath
    // );

    const exists = await jetpack.existsAsync(programPath);
    if (!exists) {
      throw new NiceError(`
        We couldn't find a file at the path you provided. Please double check
        that the file path you pasted in the test field is correct.
      `);
    }
    
    const executeResult = await executeScript('/usr/local/bin/python3', programPath);
    console.log('got an error boss:', executeResult.stderr)
    if (executeResult.exitCode !== 0) {
      return helper.fail(executeResult.stderr)
    } else {
      return helper.success(
        `
        Great work! You have completed the Trial of Salutation. Write the code
        for future challenges in the same folder as this file.
        <br/><br/>
        <span class="highlight"><em>For the glory of Python!</em></span>
      `,
        [{ name: "PYTHON_CODE_PATH", value: path.dirname(programPath) }]
      );
    }
  }

