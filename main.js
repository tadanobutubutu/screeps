// main.js

// Configuration
const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000
};

// Sample function that should be preserved
function getWelcomeMessage() {
    return 'Welcome to the application';
}

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
  initialize,
  processData,
  validateInput,
  getWelcomeMessage,
  config
};