// main.js - React Application Entry Point
// Set the language attribute on the HTML element for accessibility
// This must be set before React renders to ensure screen readers
// get the correct language information immediately
document.documentElement.lang = 'en';

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);