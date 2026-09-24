// imports
const { helperFunction } = require('./utils');
const config = require('./config');

// existing code
const appName = 'MyApp';
const version = '1.0.0';

// Line 14 TODO comment
// TODO: Update or create the affected functions to be accessible

// existing functions
function initializeApp() {
  console.log(`Initializing ${appName} v${version}`);
  return true;
}

function processData(data) {
  if (!data) return null;
  return data.map(item => item * 2);
}

// functions that need to be accessible (newly exported)
function getAppInfo() {
  return {
    name: appName,
    version: version
  };
}

function validateInput(input) {
  if (typeof input !== 'string') {
    return false;
  }
  return input.length > 0;
}

// exports
module.exports = {
  initializeApp,
  processData,
  getAppInfo,
  validateInput
};