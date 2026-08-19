// Assuming main.js is responsible for rendering the HTML content
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App'; // Assuming your main component is in App.js

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// Update the following part to include the lang attribute in the HTML
document.documentElement.lang = 'en';