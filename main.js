// Preserve all existing JavaScript code from main.js
// (This is a placeholder - please provide the actual content of your main.js file)

/**
 * Converts the fake link to a proper button for accessibility
 */
function convertFakeLinkToButton() {
  const fakeLink = document.getElementById('unrotate');
  if (fakeLink) {
    const button = document.createElement('button');
    button.id = 'unrotate';
    button.textContent = 'rotate back';
    button.className = fakeLink.className;
    button.onclick = function() {
      // Add any existing click handler logic here
      // For example, if there was rotation logic in the original link
    };
    fakeLink.parentNode.replaceChild(button, fakeLink);
  }
}

// Run the conversion when the DOM is loaded
document.addEventListener('DOMContentLoaded', convertFakeLinkToButton);

// Export any existing functions that need to be preserved
// For example:
// export function existingFunction() { ... }

/**
 * Adds scope attributes to table headers for accessibility
 */
function addTableHeaderScopes() {
  // Select all table headers in the dependency graph
  const headers = document.querySelectorAll('#dependency-graph th');

  headers.forEach(header => {
    // Check if the header already has a scope attribute
    if (!header.hasAttribute('scope')) {
      // Determine if this is a column or row header based on its position
      // This is a simplified approach - you may need to adjust based on your actual table structure
      const isColumnHeader = header.parentElement.rowIndex === 0;

      // Add the appropriate scope attribute
      header.setAttribute('scope', isColumnHeader ? 'col' : 'row');
    }
  });
}

// Run the table header scope addition when the DOM is loaded
document.addEventListener('DOMContentLoaded', addTableHeaderScopes);