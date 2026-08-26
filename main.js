// Assuming main.js is the entry point of your React application
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App'; // Adjust the path to your main App component

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// Now, add the lang attribute to the <html> tag
document.documentElement.lang = 'en';