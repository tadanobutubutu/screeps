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

// Implement the function for addressing new accessibility issues
function addressAccessibilityIssues() {
  // Assuming we are adding an ARIA role to the dependencyGraph container
  const dependencyGraph = document.querySelector('.dependencyGraph');
  if (dependencyGraph) {
    dependencyGraph.setAttribute('role', 'group');
    // You might want to set other ARIA properties or check for more complex requirements from the insight report
  }
}

export {
  VERSION,
  CONFIG,
  initialize,
  getConfig,
  getVersion,
  addressAccessibilityIssues // Add the new function to the exports
};

export default {
  VERSION,
  CONFIG,
  initialize,
  getConfig,
  getVersion,
  addressAccessibilityIssues // Add the new function to the default export
};