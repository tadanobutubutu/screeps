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

// Add main landmark wrapper for accessibility
function wrapContentInMain() {
  // Check if we're in a document context
  if (typeof document !== 'undefined') {
    // Get the body element
    const body = document.body;

    // Create a main element
    const main = document.createElement('main');

    // Move all existing children to the main element
    while (body.firstChild) {
      main.appendChild(body.firstChild);
    }

    // Append the main element to the body
    body.appendChild(main);
  }
}

// Initialize main landmark wrapper when DOM is loaded
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', wrapContentInMain);
}

// [Your existing code below this point remains unchanged]