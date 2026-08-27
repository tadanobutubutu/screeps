// TODO: Address accessibility issues from insight report:
// - ... (You can add more functions as needed)

function initAccessibility() {
  // Ensure all interactive elements are focusable and have appropriate ARIA attributes
  const focusableSelectors = 'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])';
  document.querySelectorAll(focusableSelectors).forEach(el => {
    // Make sure elements are focusable
    if (el.tabIndex === -1) el.tabIndex = 0;

    // Add ARIA roles where missing
    if (el.getAttribute('role') === null && (el.tagName === 'button' || el.tagName === 'div')) {
      el.setAttribute('role', 'button');
    }

    // Provide accessible name for interactive elements without visible text
    if (el.tagName === 'button' && !el.hasAttribute('aria-label') && !el.innerText.trim()) {
      el.setAttribute('aria-label', 'Interactive element');
    }
  });
}

// Export the function so tests can import it if needed
export { initAccessibility };