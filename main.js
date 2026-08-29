// Main application entry point

// TODO: This is the existing code that needs to be preserved
// Addressed accessibility issues from insight report

// Application initialization
document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
});

function initializeApp() {
  // Initialize accessibility features
  setupAccessibility();
  
  // Main application logic
  console.log('Application initialized');
}

function setupAccessibility() {
  // Ensure proper focus management
  document.body.setAttribute('role', 'application');
  
  // Add skip link for keyboard navigation
  const skipLink = document.createElement('a');
  skipLink.href = '#main-content';
  skipLink.className = 'skip-link';
  skipLink.textContent = 'Skip to main content';
  skipLink.style.position = 'absolute';
  skipLink.style.left = '-9999px';
  skipLink.style.top = '0';
  skipLink.addEventListener('focus', () => {
    skipLink.style.left = '0';
    skipLink.style.top = '0';
  });
  skipLink.addEventListener('blur', () => {
    skipLink.style.left = '-9999px';
  });
  document.body.insertBefore(skipLink, document.body.firstChild);
  
  // Ensure all interactive elements are keyboard accessible
  const interactiveElements = document.querySelectorAll('a, input, select, textarea');
  interactiveElements.forEach(el => {
    el.setAttribute('tabindex', '0');
  });
}

function getMainContent() {
  const main = document.querySelector('main') || document.querySelector('#main-content') || document.body;
  return main;
}

// Make functions accessible/exported for use in other modules
// Using both module export and window assignment for maximum compatibility
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initializeApp,
    setupAccessibility,
    getMainContent
  };
} else if (typeof window !== 'undefined') {
  window.initializeApp = initializeApp;
  window.setupAccessibility = setupAccessibility;
  window.getMainContent = getMainContent;
}