// main.js - Main application logic with accessibility improvements

// State management
const state = {
  currentUser: null,
  theme: 'light',
  modalOpen: false
};

// Initialize the application
function init() {
  setupEventListeners();
  loadUserPreferences();
  setupAccessibilityFeatures();
}

// Setup all event listeners
function setupEventListeners() {
  document.addEventListener('DOMContentLoaded', init);
  
  // Keyboard navigation
  document.addEventListener('keydown', handleKeyboardNavigation);
  
  // Focus management
  document.addEventListener('focus', handleFocusManagement, true);
  
  // Live region updates for screen readers
  document.addEventListener('announce', announceToScreenReader);
}

// Handle keyboard navigation
function handleKeyboardNavigation(event) {
  const focusableElements = getFocusableElements();
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  if (event.key === 'Tab') {
    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }
  
  if (event.key === 'Escape') {
    closeModal();
  }
}

// Get all focusable elements
function getFocusableElements() {
  const selector = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  return Array.from(document.querySelectorAll(selector));
}

// Handle focus management
function handleFocusManagement(event) {
  if (state.modalOpen && !event.target.closest('.modal')) {
    event.preventDefault();
    document.querySelector('.modal').focus();
  }
}

// Setup accessibility features
function setupAccessibilityFeatures() {
  // Create live region for announcements
  const liveRegion = document.createElement('div');
  liveRegion.id = 'a11y-live-region';
  liveRegion.setAttribute('aria-live', 'polite');
  liveRegion.setAttribute('aria-atomic', 'true');
  liveRegion.className = 'visually-hidden';
  liveRegion.style.cssText = 'position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0, 0, 0, 0);';
  document.body.appendChild(liveRegion);
  
  // Skip link functionality
  setupSkipLinks();
  
  // High contrast mode support
  setupHighContrastMode();
}

// Announce message to screen readers
function announceToScreenReader(message, priority = 'polite') {
  const liveRegion = document.getElementById('a11y-live-region');
  if (liveRegion) {
    liveRegion.setAttribute('aria-live', priority);
    liveRegion.textContent = '';
    setTimeout(() => {
      liveRegion.textContent = message;
    }, 100);
  }
}

// Setup skip links
function setupSkipLinks() {
  const skipLink = document.querySelector('.skip-link');
  if (skipLink) {
    skipLink.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(skipLink.getAttribute('href'));
      if (target) {
        target.setAttribute('tabindex', '-1');
        target.focus();
      }
    });
  }
}

// Setup high contrast mode
function setupHighContrastMode() {
  const prefersHighContrast = window.matchMedia('(prefers-contrast: more)').matches;
  if (prefersHighContrast) {
    document.body.classList.add('high-contrast');
  }
}

// Open modal with accessibility improvements
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    state.modalOpen = true;
    modal.setAttribute('aria-hidden', 'false');
    modal.setAttribute('aria-modal', 'true');
    modal.style.display = 'block';
    
    // Store previous focus
    state.previousFocus = document.activeElement;
    
    // Focus first focusable element
    const focusableElements = getFocusableElements.call(modal);
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }
    
    announceToScreenReader('Modal opened');
  }
}

// Close modal with accessibility improvements
function closeModal() {
  const modals = document.querySelectorAll('.modal[aria-modal="true"]');
  modals.forEach(modal => {
    modal.setAttribute('aria-hidden', 'true');
    modal.setAttribute('aria-modal', 'false');
    modal.style.display = 'none';
  });
  
  state.modalOpen = false;
  
  // Restore previous focus
  if (state.previousFocus) {
    state.previousFocus.focus();
    state.previousFocus = null;
  }
  
  announceToScreenReader('Modal closed');
}

// Load user preferences
function loadUserPreferences() {
  // Implementation
}

// Toggle theme
function toggleTheme() {
  state.theme = state.theme === 'light' ? 'dark' : 'light';
  document.body.setAttribute('data-theme', state.theme);
  
  const themeName = state.theme === 'light' ? 'light' : 'dark';
  announceToScreenReader(`Theme changed to ${themeName} mode`);
}

// Export functions
export {
  init,
  openModal,
  closeModal,
  toggleTheme,
  getFocusableElements,
  announceToScreenReader
};