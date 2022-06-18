/*
In your validation code, you can require core Node.js modules,
third-party modules from npm, or your own code, just like a regular
Node.js module (since that's what this is!)
*/
var express = require('express');
var app = express();
const assert = require("assert");
const R = require("ramda");
const path = require("path");
const jetpack = require("fs-jetpack");
const {
  NiceError,
  executeScript,
} = require("../../../../scripts/objectiveValidation");
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
  const { testingModule, instantiateScoreTestClassCmd, pythonPath, programPath } = helper.validationFields;

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
      The answer to the first question is incorrect. Please place a line to import a testing module at the top of your file.
    `);
  }

  if (!instantiateScoreTestClassCmd || !checkCanCreateInstanceOfScoreTester(instantiateScoreTestClassCmd)) {
    console.log(`The content of instantiateScoreTestClassCmd is "${instantiateScoreTestClassCmd}"`);
    return helper.fail(`
      The answer to the third question is incorrect. Please input a line of code that will instantiate a class called <strong>Score</strong>
    `);
  }

  if (!isExecutableValid) {
    console.log(`The content of isExecutableValid is "${isExecutableValid}"`);
    return helper.fail(errorMessage);
  }

  if (!programPath) {
    console.log(`The content of programPath is "${programPath}"`);
    return helper.fail(`
    Please provide a path to your Python script - e.g. C:\\code\\score.py
    `);
  }

  const exists = await jetpack.existsAsync(programPath);

  console.log(`The content of programPath is "${programPath}"`);
  if (!exists) {
    return helper.fail(`
    We couldn't find a file at the path you provided. Please double check
    that the file path you pasted in the test field is correct.
    `);
  }

  helper.success(`
  Hooray! You did it!
  `);
}
