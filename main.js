// main.js - Application entry point

// Existing utility functions
function greet(name) {
  return `Hello, ${name}!`;
}

function calculateSum(a, b) {
  return a + b;
}

// TODO: This is the existing code that needs to be preserved

// Existing configuration
const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000
};

// Existing helper function
function formatDate(date) {
  return new Date(date).toISOString().split('T')[0];
}

// Export all existing functions and configurations
module.exports = {
  greet,
  calculateSum,
  formatDate,
  config
};