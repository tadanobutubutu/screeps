// TODO: Address accessibility issues from insight report:

// Address accessibility issues from insight report

// Make functions accessible and compliant

// Ensure all interactive elements are keyboard accessible
// Add proper ARIA labels where needed
// Ensure color contrast meets WCAG standards
// Add focus indicators for interactive elements

// Export the module with accessibility improvements
module.exports = {
  // Preserve existing exports
};

// Additional accessibility helpers
const accessibilityHelpers = {
  // Function to ensure proper focus management
  manageFocus: function(element) {
    if (element && typeof element.focus === 'function') {
      element.focus();
    }
  },
  
  // Function to announce content to screen readers
  announceToScreenReader: function(message, priority = 'polite') {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.setAttribute('class', 'sr-only');
    announcement.textContent = message;
    document.body.appendChild(announcement);
    setTimeout(() => announcement.remove(), 1000);
  }
};

// Export accessibility helpers
module.exports.accessibilityHelpers = accessibilityHelpers;