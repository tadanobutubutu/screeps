// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// Fix language for the HTML root element

(function() {
  // Set lang attribute on the HTML element for accessibility (REACT_015)
  var htmlElement = document.documentElement;
  if (htmlElement && !htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', 'en');
  }
})();

import React from 'react';
import ReactDOM from 'react-dom/client';

// Main entry point - ensures a single <main> landmark in the entire document
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the Dashboard component as the primary application
root.render(
  <React.StrictMode>
    <Dashboard />
  </React.StrictMode>
);

export default Dashboard;