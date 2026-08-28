// main.js

/**
 * Adds two numbers together.
 * @param {number} a - The first number.
 * @param {number} b - The second number.
 * @returns {number} The sum of a and b.
 */
function calculateSum(a, b) {
  return a + b;
}

// Configuration
const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000
};

// Implementation details
function initialize() {
  console.log('Application initialized');
  return true;
}

function processData(data) {
  if (!data) {
    throw new Error('No data provided');
  }
  return data.map(item => ({
    ...item,
    processed: true
  }));
}

function validateInput(input) {
  if (typeof input !== 'string') {
    return false;
  }
  return input.length > 0;
}

// TODO: Implement this function for accessibility checks on tables
function checkTableAccessibility(tableElement) {
  if (!tableElement || tableElement.tagName !== 'TABLE') {
    return [{ type: 'error', message: 'Provided element is not a table' }];
  }

  const issues = [];

  // Check for caption
  const caption = tableElement.querySelector('caption');
  if (!caption) {
    issues.push({ type: 'warning', message: 'Table is missing a <caption> element' });
  }

  // Check for header cells
  const headers = tableElement.querySelectorAll('th');
  if (headers.length === 0) {
    issues.push({ type: 'error', message: 'Table has no header cells (<th>)' });
  } else {
    // Check for scope attributes on headers
    headers.forEach((header, index) => {
      if (!header.hasAttribute('scope')) {
        issues.push({ 
          type: 'warning', 
          message: `Header cell at index ${index} is missing a scope attribute` 
        });
      }
    });
  }

  // Check for thead/tbody structure
  const hasThead = tableElement.querySelector('thead');
  const hasTbody = tableElement.querySelector('tbody');
  if (!hasThead && headers.length > 0) {
    issues.push({ type: 'warning', message: 'Table headers should be wrapped in <thead>' });
  }
  if (!hasTbody) {
    issues.push({ type: 'warning', message: 'Table body should be wrapped in <tbody>' });
  }

  // Check for data cells without associated headers
  const dataCells = tableElement.querySelectorAll('td');
  dataCells.forEach((cell, index) => {
    if (!cell.headers && headers.length > 0) {
      issues.push({ 
        type: 'info', 
        message: `Data cell at index ${index} has no explicit headers association` 
      });
    }
  });

  return issues;
}

// Main execution
function main() {
  initialize();
  console.log('Main function executed');
}

// Run if executed directly
if (require.main === module) {
  main();
}

module.exports = {
  calculateSum,
  initialize,
  processData,
  validateInput,
  checkTableAccessibility,
  config
};