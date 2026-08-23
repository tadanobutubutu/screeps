// main.js - Entry point for the React application
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Get the root element
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you need to dynamically set the lang attribute:
// document.documentElement.lang = 'en';