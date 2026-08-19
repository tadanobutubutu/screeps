// main.js
// This file should contain JavaScript code, not HTML
// The HTML content should be moved to a separate file with .html or .jsx extension

// Example JavaScript content that would be appropriate for main.js:
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// Add this function to handle the main content rendering
function renderMainContent(content) {
  const mainElement = document.createElement('main');
  mainElement.innerHTML = content;
  return mainElement;
}

// Add this function to initialize the main content
function initializeMainContent() {
  const mainContent = document.getElementById('main-content');
  if (mainContent) {
    const wrappedContent = renderMainContent(mainContent.innerHTML);
    mainContent.replaceWith(wrappedContent);
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeMainContent);