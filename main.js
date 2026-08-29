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
  if (mainContent) {
    mainContent.setAttribute('role', 'main');
    mainContent.setAttribute('id', 'main-content');
  }
  
  // Add skip link for keyboard navigation
  const skipLink = document.createElement('a');
  skipLink.href = '#main-content';
  skipLink.className = 'skip-link';
  skipLink.textContent = 'Skip to main content';
  skipLink.style.position = 'absolute';
  skipLink.style.left = '-9999px';
  skipLink.style.top = '0';
  skipLink.style.zIndex = '10000';
  skipLink.addEventListener('focus', () => {
    skipLink.style.left = '0';
    skipLink.style.top = '0';
  });
  skipLink.addEventListener('blur', () => {
    skipLink.style.left = '-9999px';
  });
  document.body.insertBefore(skipLink, document.body.firstChild);
  
  // Ensure all interactive elements are keyboard accessible
  const interactiveElements = document.querySelectorAll('a, button, input, select, textarea, [role="button"]');
  interactiveElements.forEach(el => {
    if (el.tagName === 'A' || el.getAttribute('role') === 'button') {
      // Only set tabindex if not already set and doesn't have proper role
      if (!el.hasAttribute('tabindex') && !el.href) {
        el.setAttribute('tabindex', '0');
      }
    } else if (!el.hasAttribute('tabindex') && !el.disabled) {
      el.setAttribute('tabindex', '0');
    }
  });
}

function getMainContent() {
  let main = document.getElementById('main-content');
  if (!main) {
    main = document.querySelector('main');
  }
  if (!main) {
    main = document.createElement('div');
    main.setAttribute('id', 'main-content');
    document.body.appendChild(main);
  }
  return main;
}