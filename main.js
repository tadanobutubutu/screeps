// main.js
// Accessibility issues addressed as per insight report

// Ensure all interactive elements have accessible names
document.addEventListener('DOMContentLoaded', () => {
  const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
  interactiveElements.forEach(el => {
    if (!el.getAttribute('aria-label') && !el.getAttribute('aria-labelledby')) {
      // Fallback to visible text for accessible name
      const accessibleName = el.textContent || el.value || '';
      if (accessibleName) {
        el.setAttribute('aria-label', accessibleName);
      }
    }
  });
});

// Existing exports (preserved)
module.exports = {};