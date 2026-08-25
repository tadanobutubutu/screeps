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
function handleKeyboardNavigation() {
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Tab') {
      document.body.classList.add('keyboard-nav');
    }
  });
  
  document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
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

// Updated function to replace the non-accessible anchor with a button
function updateNonAccessibleLink() {
  const nonAccessibleLink = document.getElementById('unrotate');
  if (nonAccessibleLink) {
    // Remove the anchor element
    nonAccessibleLink.parentNode.removeChild(nonAccessibleLink);

    // Create a new button element
    const button = document.createElement('button');
    button.id = 'unrotate';
    button.textContent = 'rotate back';
    button.onclick = function() {
      // Add the logic to rotate back if necessary
      // For example, you might want to call a function here
    };

    // Append the button to the parent element
    nonAccessibleLink.parentNode.appendChild(button);
  }
}

// Call the function to update the non-accessible link
updateNonAccessibleLink();

module.exports = {
  prefersReducedMotion,
  applyAccessibilityAttributes,
  handleKeyboardNavigation,
  announceToScreenReader,
  updateNonAccessibleLink // Export the new function
};