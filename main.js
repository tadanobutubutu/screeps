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
  console.log('Returning configuration:', CONFIG);
  return CONFIG;
}

function getVersion() {
  console.log('Returning version:', VERSION);
  return VERSION;
}

export {
  VERSION,
  CONFIG,
  initialize,
  getConfig,
  getVersion
};

export default {
  VERSION,
  CONFIG,
  initialize,
  getConfig,
  getVersion
};