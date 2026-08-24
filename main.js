/**
 * @fileoverview Main application module with accessibility enhancements
 * @module main
 */

// TODO: Address accessibility issues from insight report:
// - Ensure proper ARIA attributes for dynamic content
// - Implement keyboard navigation support
// - Add focus management for interactive elements
// - Provide screen reader announcements for important updates

/**
 * Application state
 */
const appState = {
  theme: 'light',
  reducedMotion: false,
  currentPage: 'home'
};

/**
 * DOM elements cache
 */
const elements = {
  mainContainer: null,
  navigation: null,
  contentArea: null,
  themeToggle: null
};

/**
 * Initialize the application with accessibility features
 * @returns {void}
 */
function init() {
  // Cache DOM elements
  elements.mainContainer = document.querySelector('main') || document.body;
  elements.navigation = document.querySelector('nav');
  elements.contentArea = document.querySelector('[role="main"]') || elements.mainContainer;
  elements.themeToggle = document.getElementById('theme-toggle');

  // Check for reduced motion preference
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    appState.reducedMotion = true;
  }

  // Set up accessibility features
  setupKeyboardNavigation();
  setupFocusManagement();
  setupAriaAttributes();
  setupThemeToggle();
}

/**
 * Set up keyboard navigation support
 */
function setupKeyboardNavigation() {
  // Ensure all interactive elements are focusable
  const interactiveElements = elements.mainContainer.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  interactiveElements.forEach(element => {
    // Ensure elements have proper focus indicators
    element.addEventListener('focus', () => {
      element.classList.add('is-focused');
    });

    element.addEventListener('blur', () => {
      element.classList.remove('is-focused');
    });

    // Handle Enter key for custom interactive elements
    element.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' && element.getAttribute('role') === 'button') {
        event.preventDefault();
        element.click();
      }
    });
  });
}

/**
 * Set up focus management for dynamic content
 */
function setupFocusManagement() {
  // Announce page changes to screen readers
  if (!elements.contentArea.hasAttribute('aria-live')) {
    elements.contentArea.setAttribute('aria-live', 'polite');
    elements.contentArea.setAttribute('aria-atomic', 'true');
  }

  // Manage focus on navigation
  const navLinks = elements.navigation?.querySelectorAll('a') || [];
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      // Move focus to main content after navigation
      setTimeout(() => {
        elements.contentArea?.focus();
      }, 100);
    });
  });
}

/**
 * Set up ARIA attributes for dynamic content
 */
function setupAriaAttributes() {
  // Ensure main container has proper role
  if (!elements.mainContainer.hasAttribute('role')) {
    elements.mainContainer.setAttribute('role', 'main');
  }

  // Set up landmark roles
  if (elements.navigation && !elements.navigation.hasAttribute('role')) {
    elements.navigation.setAttribute('role', 'navigation');
  }

  // Ensure images have alt text
  const images = elements.mainContainer.querySelectorAll('img:not([alt])');
  images.forEach(img => {
    img.setAttribute('alt', '');
  });
}

/**
 * Set up theme toggle with accessibility
 */
function setupThemeToggle() {
  if (elements.themeToggle) {
    // Ensure toggle button has proper ARIA attributes
    if (!elements.themeToggle.hasAttribute('aria-label')) {
      elements.themeToggle.setAttribute('aria-label', 'Toggle dark mode');
    }
    
    if (!elements.themeToggle.hasAttribute('aria-pressed')) {
      elements.themeToggle.setAttribute('aria-pressed', appState.theme === 'dark');
    }

    elements.themeToggle.addEventListener('click', toggleTheme);
  }
}

/**
 * Toggle between light and dark themes
 */
function toggleTheme() {
  appState.theme = appState.theme === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', appState.theme);
  
  // Update ARIA state
  if (elements.themeToggle) {
    elements.themeToggle.setAttribute('aria-pressed', appState.theme === 'dark');
  }
}

/**
 * Announce a message to screen readers
 * @param {string} message - The message to announce
 * @param {string} priority - The priority level ('polite' or 'assertive')
 */
function announceToScreenReader(message, priority = 'polite') {
  let announcer = document.getElementById('screen-reader-announcer');
  
  if (!announcer) {
    announcer = document.createElement('div');
    announcer.setAttribute('id', 'screen-reader-announcer');
    announcer.setAttribute('aria-live', priority);
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    document.body.appendChild(announcer);
  }
  
  // Clear previous content
  announcer.textContent = '';
  
  // Set new content after a small delay to ensure screen readers pick up the change
  setTimeout(() => {
    announcer.textContent = message;
  }, 100);
}

/**
 * Skip to main content link for keyboard users
 */
function setupSkipLink() {
  const skipLink = document.createElement('a');
  skipLink.href = '#main-content';
  skipLink.className = 'skip-link';
  skipLink.textContent = 'Skip to main content';
  skipLink.setAttribute('aria-label', 'Skip to main content');
  
  // Insert at beginning of body
  if (document.body.firstChild) {
    document.body.insertBefore(skipLink, document.body.firstChild);
  } else {
    document.body.appendChild(skipLink);
  }
  
  // Hide visually but show on focus
  skipLink.style.position = 'absolute';
  skipLink.style.top = '-40px';
  skipLink.style.left = '0';
  skipLink.style.backgroundColor = '#000';
  skipLink.style.color = '#fff';
  skipLink.style.padding = '8px';
  skipLink.style.zIndex = '1000';
  
  skipLink.addEventListener('focus', () => {
    skipLink.style.top = '0';
  });
  
  skipLink.addEventListener('blur', () => {
    skipLink.style.top = '-40px';
  });
}

// Export public functions
export {
  init,
  toggleTheme,
  announceToScreenReader,
  setupSkipLink,
  appState
};

// Initialize when DOM is ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      init();
      setupSkipLink();
    });
  } else {
    init();
    setupSkipLink();
  }
}