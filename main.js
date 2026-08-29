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
  
  // Create main content landmark if it doesn't exist
  let mainContent = document.getElementById('main-content');
  if (!mainContent) {
    mainContent = document.createElement('div');
    mainContent.id = 'main-content';
    mainContent.setAttribute('role', 'main');
    document.body.appendChild(mainContent);
  }
  
  // Add skip link for keyboard navigation
  const skipLink = document.createElement('a');
  skipLink.href = '#main-content';
  skipLink.className = 'skip-link';
  skipLink.textContent = 'Skip to main content';
  skipLink.style.position = 'absolute';
  skipLink.style.left = '-9999px';
  skipLink.style.top = 'auto';
  skipLink.style.width = '1px';
  skipLink.style.height = '1px';
  skipLink.style.overflow = 'hidden';
  skipLink.addEventListener('focus', function() {
    this.style.position = 'fixed';
    this.style.top = '0';
    this.style.left = '0';
    this.style.width = 'auto';
    this.style.height = 'auto';
    this.style.padding = '10px';
    this.style.backgroundColor = '#fff';
    this.style.zIndex = '9999';
  });
  skipLink.addEventListener('blur', function() {
    this.style.position = 'absolute';
    this.style.left = '-9999px';
    this.style.top = 'auto';
    this.style.width = '1px';
    this.style.height = '1px';
    this.style.overflow = 'hidden';
  });
  document.body.insertBefore(skipLink, document.body.firstChild);
  
  // Ensure all interactive elements are keyboard accessible
  // Only add tabindex to elements that are not naturally focusable
  const interactiveElements = document.querySelectorAll('button, a, input, select, textarea, [contenteditable="true"]');
  interactiveElements.forEach(el => {
    // Check if element already has a tabindex or is naturally focusable
    const tabIndex = el.getAttribute('tabindex');
    if (tabIndex === null || tabIndex === '') {
      // Element is naturally focusable, no need to set tabindex
      // But ensure it has proper semantic markup
      ensureElementAccessibility(el);
    } else {
      ensureElementAccessibility(el);
    }
  });
}

function ensureElementAccessibility(element) {
  // Ensure element has accessible name
  const tagName = element.tagName.toLowerCase();
  
  if (tagName === 'button' && !element.textContent.trim() && !element.getAttribute('aria-label')) {
    // Button without text or aria-label
    console.warn('Accessibility: Button missing accessible name');
  }
  
  if (tagName === 'a' && !element.textContent.trim() && !element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby')) {
    // Link without text or labels
    console.warn('Accessibility: Link missing accessible name');
  }
}

function getMainContent() {
  return document.getElementById('main-content');
}