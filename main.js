const http = require('http');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  port: process.env.PORT || 3000,
  host: process.env.HOST || 'localhost',
  maxRetries: 3,
  timeout: 5000
};

// Utility functions
function log(message, level = 'info') {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp} [${level.toUpperCase()}] ${message}`);
}

async function initBoth() {
  if (process.env.NODE_ENV === 'browser') {
    await initBrowser();
  } else {
    await initNodeJS();
  }
}

function initBrowser() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}

function initNodeJS() {
  app.listen(CONFIG.port, () => {
    log(`Server started at http://${CONFIG.host}:${CONFIG.port}`);
  });
}

async function handleKeyNavigation(event) {
  // ... (from 'browser' implementation)
}

async function trapFocus(event) {
  // ... (from 'browser' implementation)
}

function setupKeyboardNavigation() {
  // ... (from 'browser' implementation without the event handler)
}

function setupAriaLiveRegions() {
  // ... (from 'browser' implementation)
}

function setupFocusManagement() {
  // ... (from 'browser' implementation)
}

/* Added utility functions from the Node.js implementation */
function validateInput(input) {
  if (typeof input !== 'string') {
    return false;
  }
  return input.length > 0 && input.length <= 1000;
}

function parseJSONsafe(jsonString) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    return null;
  }
}

function formatResponse(data, statusCode = 200) {
  return {
    statusCode,
    data,
    timestamp: new Date().toISOString()
  };
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function retryOperation(operation, maxRetries = CONFIG.maxRetries) {
  let lastError;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      log(`Attempt ${i + 1} failed: ${error.message}`, 'warn');
      if (i < maxRetries - 1) {
        await delay(1000 * (i + 1));
      }
    }
  }
  throw lastError;
}

function spawnSomeCommand(callback) {
  const child_process = require('child_process');
  child_process.spawn('someCommand', {}, {
    stdio: 'inherit',
  }).on('exit', (code, signal) => {
    if (code === 0) {
      callback(null, 'Successfully executed someCommand');
    } else {
      callback(new Error(`someCommand failed with code ${code}`));
    }
  });
}

module.exports = {
  validateInput,
  spawnSomeCommand,
  handleKeyNavigation,
  trapFocus,
  setupKeyboardNavigation,
  setupAriaLiveRegions,
  setupFocusManagement,
  parseJSONsafe,
  formatResponse,
  delay,
  retryOperation
};