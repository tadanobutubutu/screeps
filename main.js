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

// Add function to replace fake links with proper buttons
function replaceFakeLinks() {
  const fakeLinks = document.querySelectorAll('a[href="#"]');
  fakeLinks.forEach(link => {
    if (link.id === 'unrotate') {
      const button = document.createElement('button');
      button.id = link.id;
      button.textContent = link.textContent;
      button.className = link.className;
      button.addEventListener('click', (e) => {
        e.preventDefault();
        // Add your rotation logic here
        console.log('Rotation triggered');
      });
      link.parentNode.replaceChild(button, link);
    }
  });
}

// Call the functions when the DOM is fully loaded
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    updateTableHeaders();
    replaceFakeLinks();
  });
}

// [Rest of your existing main.js content here]
// ... (all your current code remains unchanged)

// Add this function to ensure only one main element exists
function ensureSingleMainElement() {
  // Check if there are multiple main elements
  const mainElements = document.getElementsByTagName('main');
  if (mainElements.length > 1) {
    // Keep the first main element and remove others
    for (let i = 1; i < mainElements.length; i++) {
      const parent = mainElements[i].parentNode;
      const wrapper = document.createElement('section');
      // Copy all attributes from the main element to the section
      Array.from(mainElements[i].attributes).forEach(attr => {
        wrapper.setAttribute(attr.name, attr.value);
      });
      // Move all children to the wrapper
      while (mainElements[i].firstChild) {
        wrapper.appendChild(mainElements[i].firstChild);
      }
      // Replace the main element with the section
      parent.replaceChild(wrapper, mainElements[i]);
    }
  }
}

// Add the single main element check to DOMContentLoaded
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    ensureSingleMainElement();
  });
}