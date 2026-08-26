// This is a sample main.js
const fs = require('fs');
const path = require('path');

// TODO: Import required module(s) and export the new necessary function(s) here in main.js

function readConfig() {
  return JSON.parse(fs.readFileSync('config.json', 'utf8'));
}

function getAppRoot() {
  return path.resolve(__dirname);
}

function validateInput(input) {
  if (!input || typeof input !== 'string') {
    return false;
  }
  return true;
}

module.exports = {
  readConfig,
  getAppRoot,
  validateInput
};