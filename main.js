// main.js

// TODO: Implement the required changes to improve accessibility
// Replaced with implementation

function improveAccessibility() {
  // Add ARIA labels to buttons without them
  const buttons = document.querySelectorAll('button');
  buttons.forEach(button => {
    if (!button.hasAttribute('aria-label')) {
      button.setAttribute('aria-label', button.textContent || 'Button');
    }
  });

  // Ensure all clickable elements are focusable
  const focusable = document.querySelectorAll('[role="button"], [role="link"]');
  focusable.forEach(el => {
    if (el.tabIndex < 0) el.tabIndex = 0;
  });
}

module.exports = { improveAccessibility };