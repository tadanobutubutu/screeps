// [Your existing main.js content here]
// ... (all your current code remains unchanged)

// Add the following function to handle the table header scope attributes
function updateTableHeaders() {
  // This function would be called after the DOM is loaded
  // to add scope attributes to table headers
  const headers = document.querySelectorAll('th');
  headers.forEach(header => {
    if (!header.hasAttribute('scope')) {
      // Default to 'col' scope for most headers
      header.setAttribute('scope', 'col');
      // Special cases for row headers if needed
      if (header.textContent.includes('src/')) {
        header.setAttribute('scope', 'row');
      }
    }
  });
}

// Call the function when the DOM is fully loaded
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', updateTableHeaders);
}

// Add function to handle SVG accessibility
function makeSVGsAccessible() {
  // Find all SVG elements in the document
  const svgs = document.querySelectorAll('svg');

  svgs.forEach(svg => {
    // Check if the SVG is decorative (no interactive elements)
    const hasInteractiveElements = svg.querySelector('a, button, input, select, textarea');

    if (!hasInteractiveElements) {
      // If decorative, add aria-hidden="true"
      svg.setAttribute('aria-hidden', 'true');
    } else {
      // If not decorative, ensure it has an accessible name
      if (!svg.getAttribute('aria-label') && !svg.querySelector('title')) {
        console.warn('SVG contains interactive elements but lacks an accessible name. Please add aria-label or a <title> element.');
      }
    }
  });
}

// Call the SVG accessibility function when the DOM is fully loaded
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', makeSVGsAccessible);
}

// [Rest of your existing main.js content here]
// ... (all your current code remains unchanged)