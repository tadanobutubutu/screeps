// main.js - React Application Entry Point
// Set the language attribute on the HTML element for accessibility
document.documentElement.lang = 'en';

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Add the function to replace the non-interactive link with a button
const replaceNonInteractiveLink = () => {
  // Select all anchor elements with a hash-only href attribute
  const nonInteractiveLinks = document.querySelectorAll('a[href="#"]');
  
  // Loop through the selected links and replace them with buttons
  nonInteractiveLinks.forEach((link) => {
    const button = document.createElement('button');
    button.innerHTML = link.innerHTML;
    button.onclick = link.onclick; // Preserve any click handlers
    link.parentNode.replaceChild(button, link);
  });
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
    {/* Call the function when the DOM is fully loaded */}
    <script>
      document.addEventListener('DOMContentLoaded', replaceNonInteractiveLink);
    </script>
  </React.StrictMode>
);