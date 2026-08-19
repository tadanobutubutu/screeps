// main.js - React application entry point
// This file handles the root React component rendering
// Note: For REACT_015 - The lang attribute must be set on the <html> element
// In a typical React app, this is done in: public/index.html
// Add <html lang="en"> to your public/index.html file

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// For the lang attribute accessibility fix (REACT_015):
// Ensure your public/index.html contains: <html lang="en">
// This helps screen readers use the correct language settings

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();