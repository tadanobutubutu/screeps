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

// Export existing functionality
module.exports = { app, renderContent };

// Add the lang attribute to the HTML root element
document.documentElement.lang = 'en';