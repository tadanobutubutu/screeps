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

// Add this new function to ensure only one main landmark exists
function ensureSingleMainLandmark() {
  // Check if there are multiple main elements
  const mainElements = document.querySelectorAll('main');

  if (mainElements.length > 1) {
    // Convert all but the first main to section elements
    mainElements.forEach((main, index) => {
      if (index > 0) {
        const section = document.createElement('section');
        // Copy all attributes from main to section
        Array.from(main.attributes).forEach(attr => {
          section.setAttribute(attr.name, attr.value);
        });
        // Move all children from main to section
        while (main.firstChild) {
          section.appendChild(main.firstChild);
        }
        // Replace main with section
        main.parentNode.replaceChild(section, main);
      }
    });
  }
}

// Call this function when the DOM is loaded
document.addEventListener('DOMContentLoaded', ensureSingleMainLandmark);

// [Your existing code below this point remains unchanged]