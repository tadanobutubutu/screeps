// main.js - React Application Entry Point
// Set the language attribute on the HTML element for accessibility
document.documentElement.lang = 'en';

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Updated to include the scope attribute for accessibility
const renderTableHeadersWithScope = (headerContent) => {
  return <th scope="col">{headerContent}</th>;
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);