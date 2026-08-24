// main.js or index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// If this file renders the HTML shell, you'd add lang="en" here
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);