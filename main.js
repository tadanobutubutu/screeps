// Accessibility improvements from insight report
function improveAccessibility() {
  // Add aria-label to all buttons without one
  document.querySelectorAll('button').forEach(button => {
    if (!button.hasAttribute('aria-label')) {
      button.setAttribute('aria-label', button.textContent || 'Button');
    }
  });
}

module.exports = { improveAccessibility };