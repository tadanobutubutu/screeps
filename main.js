// Main module entry point
const config = require('./config');
const utils = require('./utils');

const VERSION = '1.0.0';

function initialize(options = {}) {
  const settings = { ...config.defaults, ...options };
  return {
    version: VERSION,
    settings,
    initialized: true
  };
}

function getVersion() {
  return VERSION;
}

function getConfig() {
  return config;
}

function processData(data) {
  return utils.process(data);
}

module.exports = {
  VERSION,
  initialize,
  getVersion,
  getConfig,
  processData
};