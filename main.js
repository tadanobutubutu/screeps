// TODO: Address accessibility issues from insight report — CONTINUING

/**
 * Main application module
 * @module main
 */

// Application state
const appState = {
  isInitialized: false,
  currentView: null
};

/**
 * Initialize the application
 */
function init() {
  if (appState.isInitialized) {
    return;
  }
  
  appState.isInitialized = true;
  appState.currentView = 'home';
  
  // Set up event listeners with accessibility considerations
  setupEventListeners();
  
  // Announce initialization to screen readers
  announceToScreenReader('Application loaded');
}

/**
 * Set up all event listeners
 */
function setupEventListeners() {
  const interactiveElements = document.querySelectorAll('button, a, input, [role="button"]');
  
  interactiveElements.forEach((element) => {
    element.addEventListener('click', handleInteraction);
    
    // Add keyboard support
    element.addEventListener('keydown', handleKeyboardNavigation);
  });
}

/**
 * Handle user interactions
 * @param {Event} event - The interaction event
 */
function handleInteraction(event) {
  const target = event.currentTarget;
  
  // Ensure proper focus management for accessibility
  if (target.tagName === 'BUTTON' || target.getAttribute('role') === 'button') {
    target.focus();
  }
  
  // Log the interaction
  console.log('Interaction with:', target.tagName);
  
  // Announce the interaction to screen readers
  announceToScreenReader('Action completed');
}

/**
 * Handle keyboard navigation
 * @param {KeyboardEvent} event - The keyboard event
 */
function handleKeyboardNavigation(event) {
  if (event.key === 'Enter' || event.key === ' ') {
    handleInteraction(event);
  }
}

/**
 * Announce messages to screen readers
 * @param {string} message - The message to announce
 */
function announceToScreenReader(message) {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', 'polite');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    announcement.remove();
  }, 1000);
}

/**
 * Update the current view
 * @param {string} view - The view to switch to
 */
function setCurrentView(view) {
  appState.currentView = view;
  announceToScreenReader(`View changed to ${view}`);
}

/**
 * Get the current application state
 * @returns {Object} The current state
 */
function getAppState() {
  return { ...appState };
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    init,
    setCurrentView,
    getAppState,
    handleInteraction,
    handleKeyboardNavigation,
    announceToScreenReader,
    appState
  };
}