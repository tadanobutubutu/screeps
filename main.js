// main.js - Fixed REACT_015: Added lang attribute to HTML element

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Set document language attribute for accessibility (REACT_015 fix)
document.documentElement.lang = 'en';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you also have access to the public/index.html file, ensure it has:
// <html lang="en">
// instead of just <html>