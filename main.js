// TODO: Address accessibility issues from insight report:
// Placeholder for accessibility-related code changes

/**
 * Main application entry point
 */

// Global state
const appState = {
  currentView: 'home',
  user: null,
  settings: {}
};

// Initialize application
function initApp() {
  console.log('Application initializing...');
  setupEventListeners();
  loadUserPreferences();
  initAccessibility();
}

// Setup all event listeners
function setupEventListeners() {
  document.addEventListener('DOMContentLoaded', () => {
    initApp();
  });
  
  // Keyboard navigation
  document.addEventListener('keydown', handleKeyboardNavigation);
}

// Load user preferences
function loadUserPreferences() {
  const saved = localStorage.getItem('userPreferences');
  if (saved) {
    appState.settings = JSON.parse(saved);
  }
}

// Accessibility functions
function initAccessibility() {
  // Ensure focus management
  document.body.setAttribute('tabindex', '0');
  
  // Announce page load to screen readers
  announceToScreenReader('Page loaded successfully');
  
  // Setup skip link functionality
  setupSkipLinks();
  
  // Enhance keyboard navigation
  setupFocusManagement();
}

function announceToScreenReader(message, priority = 'polite') {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

function setupSkipLinks() {
  const skipLink = document.querySelector('a[href="#main-content"]');
  if (skipLink) {
    skipLink.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById('main-content') || document.querySelector('main');
      if (target) {
        target.setAttribute('tabindex', '-1');
        target.focus();
        announceToScreenReader('Skipped to main content');
      }
    });
  }
}

function handleKeyboardNavigation(event) {
  const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  
  if (event.key === 'Tab') {
    document.body.classList.add('keyboard-nav');
  }
}

function setupFocusManagement() {
  // Trap focus within modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      // Close modals on Escape
      const openModal = document.querySelector('[role="dialog"][aria-hidden="false"]');
      if (openModal) {
        closeModal(openModal);
      }
    }
  });
}

function closeModal(modal) {
  modal.setAttribute('aria-hidden', 'true');
  modal.setAttribute('tabindex', '-1');
  announceToScreenReader('Dialog closed');
  
  // Return focus to trigger element
  const trigger = document.activeElement;
  if (trigger && trigger.dataset.modalTrigger) {
    trigger.focus();
  }
}

function getAppState() {
  return appState;
}

// Export public functions
window.main = {
  initApp,
  getAppState
};