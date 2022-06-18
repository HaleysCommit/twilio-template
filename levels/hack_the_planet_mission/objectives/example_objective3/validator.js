/*
In your validation code, you can require core Node.js modules,
third-party modules from npm, or your own code, just like a regular
Node.js module (since that's what this is!)
*/
const assert = require("assert");
const R = require("ramda");
const { isTwilio, checkTestModuleIsPytest, checkCanCreateInstanceOfScoreTester } = require("../lib/example_helper");

/*
Objective validators export a single function, which is passed a helper
object. The helper object contains information passed in from the game UI,
such as what the player entered into the fields in the hack interface.

The helper object also has "success" and "fail" callback functions - use
these functions to let the game (and the player) know whether or not they 
have completed the challenge as instructed.
*/
module.exports = async function (helper) {
  // We start by getting the user input from the helper
  const { testingModule, instantiateScoreTestClassCmd, pythonPath } = helper.validationFields;

  const args = ['--version'];

  const [isExecutableValid, errorMessage] = await helper.isExecutableValid(
    pythonPath,
    args
  );

  // Next, you test the user input - fail fast if they get one of the
  // answers wrong, or some aspect is wrong! Don't provide too much
  // negative feedback at once, have the player iterate.
  if (!testingModule || !checkTestModuleIsPytest(testingModule)) {
    return helper.fail(`
      The answer to the firt question is incorrect. Please place a line to import a testing module at the top of your file.
    `);
  }

  if (!instantiateScoreTestClassCmd || !checkCanCreateInstanceOfScoreTester(instantiateScoreTestClassCmd)) {
    console.log(`The content of instantiateScoreTestClassCmd is "${instantiateScoreTestClassCmd}"`);
    return helper.fail(`
      The answer to the third question is incorrect. Please place a line to import a testing module at the top of your file.
    `);
  }

  if (!isExecutableValid) {
    console.log(`The content of isExecutableValid is "${isExecutableValid}"`);
    return helper.fail(errorMessage);
  }

  // The way we usually write validators is to fail fast, and then if we reach
  // the end, we know the user got all the answers right!
  helper.success(`
    Hooray! You did it!
  `);
};
