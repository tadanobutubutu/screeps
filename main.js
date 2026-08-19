// Main entry point for the React application
// Note: The lang="en" attribute should be set in index.html on the <html> element, not in main.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Preserve all existing exports and functions from the original main.js
export { root };