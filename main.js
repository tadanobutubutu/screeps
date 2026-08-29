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
  const mainContent = getMainContent();
  
  // Add skip link for keyboard navigation
  const skipLink = document.createElement('a');
  skipLink.href = '#main-content';
  skipLink.className = 'skip-link';
  skipLink.textContent = 'Skip to main content';
  document.body.insertBefore(skipLink, document.body.firstChild);
  
  // Ensure all interactive elements are keyboard accessible
  const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
  interactiveElements.forEach(el => {
    el.setAttribute('tabindex', '0');
  });
}

function getMainContent() {
  return document.getElementById('main-content') || document.body;
}

/**
 * Count the number of dependencies in a package.json-like object
 * @param {Object} packageJson - Package.json object or similar structure
 * @returns {Object} Object containing counts of different dependency types
 */
function countDependencies(packageJson) {
  const dependencyTypes = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'];
  const counts = {
    total: 0,
    dependencies: 0,
    devDependencies: 0,
    peerDependencies: 0,
    optionalDependencies: 0
  };

  if (!packageJson) {
    return counts;
  }

  dependencyTypes.forEach(type => {
    if (packageJson[type]) {
      const depCount = Object.keys(packageJson[type]).length;
      counts[type] = depCount;
      counts.total += depCount;
    }
  });

  return counts;
}

// Export for testing and external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initializeApp,
    setupAccessibility,
    getMainContent,
    countDependencies
  };
}