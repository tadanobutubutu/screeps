// [Previous existing code remains unchanged]

// Add scope attributes to table headers in dependency-graph.html
// This is a temporary fix until the HTML can be properly generated with scope attributes
document.addEventListener('DOMContentLoaded', function() {
  // Select all th elements in the document
  const headers = document.querySelectorAll('th');

  headers.forEach(header => {
    // Check if the header already has a scope attribute
    if (!header.hasAttribute('scope')) {
      // Determine if it's a column or row header based on context
      if (header.closest('thead') || header.closest('tr:first-child')) {
        header.setAttribute('scope', 'col');
      } else if (header.closest('tr')) {
        header.setAttribute('scope', 'row');
      }
    }
  });
});

// Add a new function to handle accessibility checks if needed
function accessibilityCheck() {
  const headers = document.querySelectorAll('th');
  headers.forEach(header => {
    if (!header.hasAttribute('scope')) {
      if (header.closest('thead') || header.closest('tr:first-child')) {
        header.setAttribute('scope', 'col');
      } else if (header.closest('tr')) {
        header.setAttribute('scope', 'row');
      }
    }
  });
}

// Call the accessibilityCheck function on document load
document.addEventListener('DOMContentLoaded', accessibilityCheck);

// [Rest of existing code remains unchanged]