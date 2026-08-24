// main.js - React Entry Point
// Ensure the root HTML element has lang attribute for accessibility

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Get the root element
const rootElement = document.getElementById('root');

// Ensure the document.documentElement has the lang attribute
if (document.documentElement && !document.documentElement.getAttribute('lang')) {
  document.documentElement.setAttribute('lang', 'en');
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);