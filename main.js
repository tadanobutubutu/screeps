// main.js

const config = require('./config');
const logger = require('./utils/logger');

// Application state
let isInitialized = false;
const appData = {};

// TODO: Add back any required exports that might have been?

function initialize(options = {}) {
  if (isInitialized) {
    logger.warn('App already initialized');
    return false;
  }
  
  config.set(options);
  isInitialized = true;
  logger.info('Application initialized');
  return true;
}

function getAppState() {
  return {
    isInitialized,
    ...appData
  };
}

function setData(key, value) {
  appData[key] = value;
  return appData;
}

function getData(key) {
  return appData[key];
}

function shutdown() {
  isInitialized = false;
  logger.info('Application shutdown complete');
}

module.exports = {
  initialize,
  getAppState,
  setData,
  getData,
  shutdown,
  config,
  logger
};