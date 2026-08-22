/**
 * Main application entry point
 * Main.js handles the core functionality
 */

// Existing code preserved
const app = {
  init: function() {
    console.log('Application initialized');
  }
};

// Existing functions preserved
function renderContent() {
  return document.getElementById('main-content');
}

// New function to wrap content in <main> tag
function wrapContentInMain() {
  const mainContent = document.getElementById('main-content');
  if (mainContent) {
    const mainTag = document.createElement('main');
    mainTag.appendChild(mainContent);
    mainContent.parentNode.replaceChild(mainTag, mainContent);
  }
}

// Export existing functionality
module.exports = { app, renderContent, wrapContentInMain };