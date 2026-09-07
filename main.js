// TODO: Address accessibility issues from insight report:
// - REACT_025: Add other accessibility changes as per the insight report
// - [NEW] ADD YOUR CODE HERE if any other issues need to be addressed

// Accessibility enhancement: ensure interactive elements have aria-labels
function addAriaLabels() {
  const interactiveSelectors = ['button', 'a', 'input', 'select', 'textarea', '[role="button"]', '[role="link"]', '[role="checkbox"]', '[role="radio"]'];
  const elements = document.querySelectorAll(interactiveSelectors.join(','));
  elements.forEach(el => {
    if (!el.hasAttribute('aria-label') && !el.hasAttribute('aria-labelledby')) {
      const label = el.textContent?.trim() || el.getAttribute('aria-label') || 'Interactive element';
      el.setAttribute('aria-label', label);
    }
  });
}

// Run after DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', addAriaLabels);
} else {
  addAriaLabels();
}