import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

document.documentElement.lang = 'en';
reportWebVitals();

const VERSION = '1.0.0';

const CONFIG = {
  apiUrl: process.env.API_URL || 'http://localhost:3000',
  env: process.env.NODE_ENV || 'development'
};

function initialize() {
  console.log('Application initialized');
  return true;
}

function getConfig() {
  return CONFIG;
}

function getVersion() {
  return VERSION;
}

// Replace the <a> tag with a <button> element
// <button id="unrotate" role="button" aria-label="rotate back" onclick="rotateBack()">rotate back</button>

// If the `rotateBack` function is defined elsewhere in main.js, ensure it's called when the button is clicked.
// If not, define it here:
function rotateBack() {
  // Your code to rotate back
}

// Ensure that all interactive elements have appropriate keyboard support
// (This may not be applicable if there aren't any other interactive elements)

// Check that ARIA attributes are correctly paired and have appropriate values
// (This may not be applicable if there aren't any other ARIA attributes to check)

// Uncomment the implementation of the function for addressing new accessibility issues from the insight report
function addressAccessibilityIssues() {
  // TODO: Implement the function for addressing new accessibility issues
}

export {
  VERSION,
  CONFIG,
  initialize,
  getConfig,
  getVersion,
  rotateBack,
  addressAccessibilityIssues,
};

export default {
  VERSION,
  CONFIG,
  initialize,
  getConfig,
  getVersion,
  rotateBack,
  addressAccessibilityIssues,
};