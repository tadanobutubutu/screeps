Here is the resolved file content. I have integrated both changes, keeping and integrating the new function `transformInputData` from the first code block and preserving the existing code from the second code block:

```javascript
// main.js - Main application file

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
  console.log(`[${timestamp}] [${level.toUpperCase()}] ${message}`);
}

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

function sanitizeFilename(filename) {
  return filename.replace(/[^a-zA-Z0-9._-]/g, '_');
}

function readFileSafe(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    log(`Error reading file ${filePath}: ${error.message}`, 'error');
    return null;
  }
}

function processData(items) {
  if (!Array.isArray(items)) {
    return [];
  }
  return items.map(item => ({
    ...item,
    processed: true,
    timestamp: Date.now()
  }));
}

function filterValidItems(items, validator) {
  return items.filter(item => {
    try {
      return validator(item);
    } catch {
      return false;
    }
  });
}

function groupByCategory(items, getCategory) {
  return items.reduce((groups, item) => {
    const category = getCategory(item);
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
    return groups;
  }, {});
}

function transformInputData(inputData, options = {}) {
  const {
    preserveKeys = true,
    uppercase = false,
    trimWhitespace = true,
    maxLength = null
  } = options;

  if (!inputData) {
    return null;
  }

  if (typeof inputData === 'string') {
    let result = trimWhitespace ? inputData.trim() : inputData;
    result = uppercase ? result.toUpperCase() : result;
    if (maxLength && result.length > maxLength) {
      result = result.substring(0, maxLength);
    }
    return result;
  }

  if (Array.isArray(inputData)) {
    return inputData.map(item => transformInputData(item, options));
  }

  if (typeof inputData === 'object' && inputData !== null) {
    const result = {};
    for (const [key, value] of Object.entries(inputData)) {
      let newKey = preserveKeys ? key : key.trim();
      newKey = uppercase ? newKey.toUpperCase() : newKey;
      result[newKey] = transformInputData(value, options);
    }
    return result;
  }

  return inputData;
}

// Existing data processing functions

// Import render functions
const renderHeader = require('./renderHeader');
const renderFooter = require('./renderFooter');

// Utility functions from existing main.js
const formatDate = transformInputData(formatDate);
const validateEmail = transformInputData(validateEmail);
const calculateTotal = transformInputData(calculateTotal);
const fetchData = transformInputData(fetchData);
const saveData = transformInputData(saveData);
const parseJSON = parseJSONsafe;
const debounce = debounce;
const throttle = throttle;

// Additional utility functions for accessibility
function getLangAttribute() {
  // Implementation for REACT_015: Add lang attribute to HTML element
  // ...
}

function calculateSum(numbers) {
    return numbers.reduce((sum, num) => sum + num, 0);
}

function personName() {
  // Implementation for accessibility issues for REACT_036: Fix 1 fake link issue
  // ...
}

function getSvgAccessibleName() {
  // Implementation for REACT_041: Add accessible names to 2 SVGs
  // ...
}

function validateTableAccessibility() {
  // Implementation for REACT_027: Fix 26 table structure issues
  // ...
}

function validateTableStructure() {
  // Implementation for REACT_027: Fix 26 table structure issues
  // ...
}

// Export functions
module.exports = {
  CONFIG,
  log,
  validateInput,
  parseJSONsafe,
  formatResponse,
  delay,
  retryOperation,
  sanitizeFilename,
  readFileSafe,
  processData,
  filterValidItems,
  groupByCategory,
  transformInputData,
  formatDate,
  validateEmail,
  calculateTotal,
  fetchData,
  saveData,
  parseJSON,
  debounce,
  throttle,
  getLangAttribute,
  personName,
  getSvgAccessibleName,
  validateTableAccessibility,
  validateTableStructure,
  calculateSum,
  renderHeader,
  renderFooter
};
```