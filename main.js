// Existing code from main.js (not affected by the issue)

// New code or changes requested in the issue
const tableHeaders = document.querySelectorAll('th');

/**
 * Wraps content in a main landmark element for accessibility compliance
 * @param {React.ReactNode} children - The content to wrap
 * @returns {React.ReactElement} The content wrapped in a main element
 */
function wrapInMain(children) {
  return React.createElement('main', null, children);
}

// ... (rest of existing code remains unchanged)

tableHeaders.forEach(header => {
  if (!header.hasAttribute('scope')) {
    header.setAttribute('scope', 'col');
  }
});

// Existing code from main.js (not affected by the issue)