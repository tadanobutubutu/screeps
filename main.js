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

// Function to ensure unique landmarks
function ensureUniqueLandmarks(landmarks) {
  if (!Array.isArray(landmarks)) {
    return [];
  }

  const seen = new Set();
  return landmarks.filter(landmark => {
    if (!landmark) return false;

    const identifier = landmark.id || landmark.name || JSON.stringify(landmark);

    if (seen.has(identifier)) {
      return false;
    }
    seen.add(identifier);
    return true;
  });
}

// Add the lang attribute to the exports object
const exportsObject = {
  calculateDistance,
  toRad,
  ensureUniqueLandmarks,
  lang: 'en' // Add the requested lang attribute
};

// Export updated object as module.exports
module.exports = exportsObject;