// main.js - Application entry point

// Import modules
import { initializeApp } from './app.js';
import { setupNavigation } from './navigation.js';
import { renderDashboard } from './dashboard.js';

// Application state
const state = {
  currentView: 'dashboard',
  user: null,
  accessibilitySettings: {
    highContrast: false,
    reducedMotion: false,
    fontSize: 'medium'
  }
};

// TODO: Address accessibility issues from insight report:

/**
 * Initialize the application with accessibility support
 */
function initApp() {
  const appContainer = document.getElementById('app');
  
  if (!appContainer) {
    console.error('App container not found');
    return;
  }

  // Set up ARIA live region for dynamic content updates
  const liveRegion = document.createElement('div');
  liveRegion.setAttribute('aria-live', 'polite');
  liveRegion.setAttribute('aria-atomic', 'true');
  liveRegion.className = 'sr-only';
  liveRegion.id = 'announcer';
  document.body.appendChild(liveRegion);

  // Announce page load for screen readers
  announce('Application loaded');

  // Initialize main application
  initializeApp();
  setupNavigation();
  renderDashboard();

  // Set up keyboard navigation
  setupKeyboardNavigation();

  // Handle skip link
  setupSkipLink();
}

/**
 * Announce messages to screen readers via ARIA live region
 * @param {string} message - The message to announce
 */
function announce(message) {
  const announcer = document.getElementById('announcer');
  if (announcer) {
    announcer.textContent = message;
    // Clear after announcement
    setTimeout(() => {
      announcer.textContent = '';
    }, 1000);
  }
}

/**
 * Set up keyboard navigation for the application
 */
function setupKeyboardNavigation() {
  document.addEventListener('keydown', (e) => {
    // Handle Escape key to close modals/menus
    if (e.key === 'Escape') {
      closeActiveOverlays();
    }

    // Handle Tab key for focus management
    if (e.key === 'Tab') {
      manageFocus(e);
    }
  });

  // Ensure focus is visible
  document.addEventListener('mousedown', () => {
    document.body.classList.add('using-mouse');
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      document.body.classList.remove('using-mouse');
    }
  });
}

/**
 * Manage focus for accessibility
 * @param {KeyboardEvent} event - The keyboard event
 */
function manageFocus(event) {
  const focusableElements = document.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault();
    lastElement.focus();
  } else if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault();
    firstElement.focus();
  }
}

/**
 * Close any active overlays or modals
 */
function closeActiveOverlays() {
  const activeModal = document.querySelector('[role="dialog"]:not([aria-hidden="true"])');
  const activeMenu = document.querySelector('[role="menu"]:not([aria-hidden="true"])');
  
  if (activeModal) {
    activeModal.setAttribute('aria-hidden', 'true');
    announce('Dialog closed');
  }
  
  if (activeMenu) {
    activeMenu.setAttribute('aria-hidden', 'true');
    announce('Menu closed');
  }
}

/**
 * Set up skip link functionality
 */
function setupSkipLink() {
  const skipLink = document.querySelector('a[href="#main-content"]');
  if (skipLink) {
    skipLink.addEventListener('click', (e) => {
      e.preventDefault();
      const mainContent = document.getElementById('main-content') || document.querySelector('main');
      if (mainContent) {
        mainContent.setAttribute('tabindex', '-1');
        mainContent.focus();
        announce('Skipped to main content');
      }
    });
  }
}

/**
 * Update accessibility settings
 * @param {Object} settings - New accessibility settings
 */
function updateAccessibilitySettings(settings) {
  state.accessibilitySettings = { ...state.accessibilitySettings, ...settings };
  
  // Apply high contrast mode
  if (state.accessibilitySettings.highContrast) {
    document.body.classList.add('high-contrast');
  } else {
    document.body.classList.remove('high-contrast');
  }

  // Apply reduced motion
  if (state.accessibilitySettings.reducedMotion) {
    document.documentElement.style.setProperty('--animation-duration', '0s');
  }

  // Announce settings change
  announce('Accessibility settings updated');
}

/**
 * Get current accessibility settings
 * @returns {Object} Current accessibility settings
 */
function getAccessibilitySettings() {
  return { ...state.accessibilitySettings };
}

/**
 * Focus trap for modals
 * @param {HTMLElement} container - The container to trap focus within
 */
function trapFocus(container) {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  container.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  });

  // Focus the first focusable element
  if (firstElement) {
    firstElement.focus();
  }
}

/**
 * Create accessible button with proper ARIA attributes
 * @param {string} text - Button text
 * @param {Function} onClick - Click handler
 * @param {Object} options - Additional options
 * @returns {HTMLButtonElement} The created button
 */
function createAccessibleButton(text, onClick, options = {}) {
  const button = document.createElement('button');
  button.textContent = text;
  button.type = 'button';
  
  if (options.id) button.id = options.id;
  if (options.className) button.className = options.className;
  if (options['aria-label']) button.setAttribute('aria-label', options['aria-label']);
  if (options['aria-expanded']) button.setAttribute('aria-expanded', options['aria-expanded']);
  if (options['aria-controls']) button.setAttribute('aria-controls', options['aria-controls']);
  if (options.disabled) {
    button.disabled = true;
    button.setAttribute('aria-disabled', 'true');
  }

  button.addEventListener('click', onClick);
  
  return button;
}

// Export functions for use in other modules
export {
  initApp,
  announce,
  updateAccessibilitySettings,
  getAccessibilitySettings,
  trapFocus,
  createAccessibleButton,
  state
};

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}