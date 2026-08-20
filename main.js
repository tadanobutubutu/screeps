// [Your existing code above this point remains unchanged]

// Add this new function to handle table header scope attributes
function addTableHeaderScopes() {
  // Select all th elements in your table
  const headers = document.querySelectorAll('th');

  headers.forEach((header, index) => {
    // Check if the header already has a scope attribute
    if (!header.hasAttribute('scope')) {
      // Determine if this is a column or row header based on position
      // This is a simple heuristic - you may need to adjust based on your actual table structure
      if (index === 0) {
        header.setAttribute('scope', 'col');
      } else {
        header.setAttribute('scope', 'row');
      }
    }
  });
}

// Call this function when your table is rendered
document.addEventListener('DOMContentLoaded', addTableHeaderScopes);

// Add this function to handle SVG accessibility
function makeSVGsAccessible() {
  // Select all SVG elements in the document
  const svgs = document.querySelectorAll('svg');

  svgs.forEach(svg => {
    // Check if the SVG is decorative (no semantic meaning)
    if (svg.getAttribute('aria-hidden') !== 'true' &&
        !svg.querySelector('title') &&
        !svg.getAttribute('aria-label')) {

      // If it's a favicon, mark it as decorative
      if (svg.closest('link[rel="icon"]')) {
        svg.setAttribute('aria-hidden', 'true');
      }
      // For other SVGs, you might want to add a title or aria-label
      // depending on your specific use case
    }
  });
}

// Call this function when the DOM is loaded
document.addEventListener('DOMContentLoaded', makeSVGsAccessible);

// [Your existing code below this point remains unchanged]