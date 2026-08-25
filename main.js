// TODO: Address accessibility issues from insight report:
// Placeholder for accessibility-related code changes

/**
 * Check if the user prefers reduced motion
 * @returns {boolean}
 */
function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Apply accessibility attributes to interactive elements
 */
function applyAccessibilityAttributes() {
  const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
  
  interactiveElements.forEach(element => {
    if (!element.getAttribute('aria-label') && !element.textContent.trim()) {
      console.warn('Interactive element missing accessible label:', element);
    }
  });
}

/**
 * Handle keyboard navigation focus management
 */
function setupKeyboardNavigation(container) {
  container.addEventListener('keydown', (event) => {
    if (event.key === 'Tab') {
      container.classList.add('keyboard-nav');
    }
  });
  
  container.addEventListener('mousedown', () => {
    container.classList.remove('keyboard-nav');
  });
}

/**
 * Announce dynamic content changes to screen readers
 * @param {string} message - The message to announce
 * @param {string} priority - 'polite' or 'assertive'
 */
function announceToScreenReader(message, priority = 'polite') {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Validate unique landmarks to ensure only one main landmark exists
 * Addresses REACT_025 - React Unique Landmarks accessibility warning
 * @returns {Object} Validation result with isValid flag and details
 */
function validateUniqueLandmarks() {
  const mainElements = document.querySelectorAll('main');
  const result = {
    isValid: true,
    mainCount: mainElements.length,
    issues: []
  };
  
  if (mainElements.length > 1) {
    result.isValid = false;
    result.issues.push(`Found ${mainElements.length} <main> landmarks. Only one should exist per page for accessibility.`);
    console.warn('REACT_025: Multiple <main> landmarks detected. Use <section> or <article> for additional content regions.');
  }
  
  return result;
}

/**
 * Get all landmark elements for accessibility auditing
 * @returns {Object} Object containing all landmark counts
 */
function getLandmarkCounts() {
  const landmarks = ['main', 'nav', 'aside', 'header', 'footer', 'article', 'section'];
  const counts = {};
  
  landmarks.forEach(landmark => {
    counts[landmark] = document.querySelectorAll(landmark).length;
  });
  
  return counts;
}

module.exports = {
  prefersReducedMotion,
  applyAccessibilityAttributes,
  setupKeyboardNavigation,
  announceToScreenReader,
  validateUniqueLandmarks,
  getLandmarkCounts
};