// main.js
// Example React application entry point

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Additional utility functions and exports that should be preserved
export const initializeApp = (config) => {
  console.log('App initialized with config:', config);
  return true;
};

export const getAppVersion = () => {
  return '1.0.0';
};

export const validateProps = (props) => {
  const required = ['id', 'title'];
  const missing = required.filter(key => !props[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required props: ${missing.join(', ')}`);
  }
  
  return true;
};