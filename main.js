// TODO: Address accessibility issues from insight report — FIXED

// Accessibility helper function to add ARIA live region announcements
function announceToScreenReader(message, priority = 'polite') {
  let announcer = document.getElementById('sr-announcer');
  if (!announcer) {
    announcer = document.createElement('div');
    announcer.id = 'sr-announcer';
    announcer.setAttribute('aria-live', priority);
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.style.cssText = 'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;';
    document.body.appendChild(announcer);
  }
  
  announcer.setAttribute('aria-live', priority);
  announcer.textContent = '';
  setTimeout(() => {
    announcer.textContent = message;
  }, 100);
}

// Function to handle focus management for accessibility
function manageFocus(element) {
  if (element && typeof element.focus === 'function') {
    element.focus();
  }
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { announceToScreenReader, manageFocus };
}