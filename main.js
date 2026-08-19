// Main entry point for the application
// This file serves as the JavaScript entry point

// Export any necessary functions or initialize the application
function initializeApp() {
  console.log('Application initialized');
}

// Auto-initialize if in browser environment
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', initializeApp);
}

// Add main landmark for React components
function wrapWithMain(element) {
  const main = document.createElement('main');
  main.appendChild(element);
  return main;
}

// Function to add main landmark to primary content
function addMainLandmark() {
  const primaryContent = document.querySelector('.primary-content');
  if (primaryContent) {
    const mainElement = wrapWithMain(primaryContent);
    primaryContent.parentNode.replaceChild(mainElement, primaryContent);
  }
}

// Enhanced initialization with accessibility features
function initializeAppWithAccessibility() {
  initializeApp();
  addMainLandmark();
}

// Update the DOMContentLoaded listener
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', initializeAppWithAccessibility);
}

module.exports = { initializeApp, initializeAppWithAccessibility, wrapWithMain, addMainLandmark };