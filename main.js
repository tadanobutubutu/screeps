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

// Add this new function to handle fake links
function replaceFakeLinksWithButtons() {
  // Select all anchor tags with href="#"
  const fakeLinks = document.querySelectorAll('a[href="#"]');

  fakeLinks.forEach(link => {
    // Create a new button element
    const button = document.createElement('button');

    // Copy all attributes from the link to the button
    Array.from(link.attributes).forEach(attr => {
      button.setAttribute(attr.name, attr.value);
    });

    // Copy the link's content to the button
    button.innerHTML = link.innerHTML;

    // Replace the link with the button
    link.parentNode.replaceChild(button, link);
  });
}

// Call this function when the DOM is loaded
document.addEventListener('DOMContentLoaded', replaceFakeLinksWithButtons);

// [Your existing code below this point remains unchanged]