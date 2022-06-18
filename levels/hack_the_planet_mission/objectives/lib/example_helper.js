// This is an example of how you might use objective validation helpers
// in your own code. You don't have to, but you'll often want to!
function isTwilio(testString = '') {
  return testString.toLowerCase() == 'vscode';
}

function checkGitCloneCmd(gitProjectName = '', gitCloneCmdName = '') {
  let gitCloneCmd = `git clone ${gitProjectName}`
  return gitCloneCmdName.toString() == gitCloneCmd;
}

function checkBuildVirtualEnvCmd(virtualEnvCmd = '') {
  let virtualEnvCmdExpected = 'source activate venv/bin/activate'
  return virtualEnvCmd.toString() == virtualEnvCmdExpected;
}

function checkTestModuleIsPytest(pytestImportCmd = '') {
  let pytestImportCmdExpected = 'import pytest'
  return pytestImportCmd.toString() == pytestImportCmdExpected;
}

function checkCanCreateInstanceOfScoreTester(checkInstantiateScoreClassCmd = '') {
  let checkInstantiateScoreClassExpected = 'def test_CanInstantiateScoreClass():'
  return checkInstantiateScoreClassCmd.toString() == checkInstantiateScoreClassExpected;
}

module.exports = {
  isTwilio,
  checkGitCloneCmd,
  checkBuildVirtualEnvCmd,
  checkTestModuleIsPytest,
  checkCanCreateInstanceOfScoreTester
};
