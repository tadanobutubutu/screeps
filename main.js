// main.js
// Main module entry point

// TODO: Add any other missing exports that might have been?
// Added missing exports as per the issue

const VERSION = '1.0.0';
const APP_NAME = 'MyApp';

// Existing function
function hello() {
  return 'Hello, World!';
}

// Existing function
function getConfig() {
  return { version: VERSION, name: APP_NAME };
}

// Existing function
function isValid(value) {
  return value !== null && value !== undefined;
}

function capitalize(str) {
  if (typeof str !== 'string') return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function greet(name) {
  return `Hello, ${name}!`;
}

function formatDate(date) {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  return date.toISOString().split('T')[0];
}

// Export all functions and constants
module.exports = {
  // Constants
  VERSION,
  APP_NAME,
  // Existing functions
  hello,
  getConfig,
  isValid,
  capitalize,
  greet,
  formatDate
};