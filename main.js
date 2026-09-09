// TODO: Implement spawning logic

/**
 * Spawning utilities for managing entity creation and lifecycle
 */
const AccessibilityUtils = {
  // (Your existing functions)

  /**
   * Ensure the element has an id and an aria-label
   * @param {HTMLElement} element - The HTML element to check
   * @returns {boolean} True if the element has both an id and an aria-label, false otherwise
   */
  hasIdAndAriaLabel(element) {
    return Boolean(element.id && element.getAttribute('aria-label'));
  },

  /**
   * Add an id and aria-label to an element
   * @param {HTMLElement} element - The HTML element to update
   * @param {string} id - The new ID for the element
   * @param {string} ariaLabel - The new aria-label for the element
   */
  addIdAndAriaLabel(element, id, ariaLabel) {
    element.id = id;
    element.setAttribute('aria-label', ariaLabel);
  },

// Function for ensuring unique landmarks
function ensureUniqueLandmarks(landmarks) {
  if (!Array.isArray(landmarks)) {
    return [];
  }
  
  const seen = new Set();
  return landmarks.filter(landmark => {
    if (!landmark) return false;
    
    const identifier = landmark.id || landmark.name || landmark.location || JSON.stringify(landmark);
    
    if (seen.has(identifier)) {
      return false;
    }
    seen.add(identifier);
    return true;
  });
}

// Initialize accessibility features on DOM ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    // Ensure skip link functionality if present
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = skipLink.getAttribute('href') || '#main-content';
        const target = document.querySelector(targetId);
        if (target) {
          target.setAttribute('tabindex', '-1');
          target.focus();
        }
      });
    }
  });
}