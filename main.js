// TODO: Address accessibility issues from insight report:

/**
 * Manages focus for accessibility
 * Ensures focus is properly set when modal/content changes
 */
function manageFocus(element) {
  if (element && element.focus) {
    element.setAttribute('tabindex', '-1');
    element.focus();
  }
}

/**
 * Announces content to screen readers
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
  setTimeout(() => announcement.remove(), 1000);
}

/**
 * Handles keyboard navigation for accessible interactions
 * @param {KeyboardEvent} event - The keyboard event
 * @param {Object} options - Configuration options
 */
function handleKeyboardNav(event, options = {}) {
  const { onEscape, onEnter, onTab } = options;
  
  switch (event.key) {
    case 'Escape':
      if (onEscape) onEscape();
      break;
    case 'Enter':
      if (onEnter) onEnter();
      break;
    case 'Tab':
      if (onTab) onTab();
      break;
  }
}

/**
 * Sets ARIA attributes for expandable/collapsible content
 * @param {HTMLElement} trigger - The trigger element
 * @param {HTMLElement} content - The content element
 * @param {boolean} isExpanded - Whether content is expanded
 */
function setExpandableAria($$trigger, $content, isExpanded) {
  if ($$trigger) {
    $trigger.setAttribute('aria-expanded', isExpanded);
    $trigger.setAttribute('aria-controls', $content?.id || '');
  }
  if ($content) {
    $content.setAttribute('aria-hidden', !isExpanded);
  }
}

/**
 * Validates form inputs with proper ARIA descriptions
 * @param {HTMLInputElement} input - The input element
 * @param {string} errorId - ID of the error message element
 * @param {boolean} isValid - Whether the input is valid
 */
function setInputAriaValidity(input, errorId, isValid) {
  if (!input) return;
  
  input.setAttribute('aria-invalid', !isValid);
  input.setAttribute('aria-describedby', isValid ? '' : errorId);
  
  const errorElement = document.getElementById(errorId);
  if (errorElement) {
    errorElement.setAttribute('role', 'alert');
    errorElement.setAttribute('aria-live', 'polite');
  }
}

/**
 * Validates landmark objects for user safety
 * Checks that landmarks have valid names and geographic coordinates
 * @param {Object} landmark - The landmark object to validate
 * @returns {boolean} True if the landmark is valid
 */
function validateLandmark(landmark) {
  if (!landmark) return false;
  if (!landmark.name || typeof landmark.name !== 'string') return false;
  if (typeof landmark.lat !== 'number' || typeof landmark.lng !== 'number') return false;
  if (landmark.lat < -90 || landmark.lat > 90) return false;
  if (landmark.lng < -180 || landmark.lng > 180) return false;
  return true;
}

// Existing code preserved below
const main = {
  announceToScreenReader,
  manageFocus,
  handleKeyboardNav,
  setExpandableAria,
  setInputAriaValidity,
  validateLandmark
};

module.exports = main;