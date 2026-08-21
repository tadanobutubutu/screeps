function createTableHeaders() {
  // Existing logic to create headers...

  // New code to fix the issue
  // Wrap the primary content in a <main> tag
  const mainContent = document.createElement('main');

  // Find the existing primary content container
  const container = document.querySelector('.container');

  // Replace the existing primary content with the <main> element
  if (container) {
    container.parentNode.replaceChild(mainContent, container);

    // Append the existing primary content back to the <main> element
    mainContent.appendChild(container);
  }

  // Ensure that only one <main> element exists in the document
  const mainElements = document.querySelectorAll('main');
  if (mainElements.length > 1) {
    // If there are multiple <main> elements, remove all but the first one
    mainElements.slice(1).forEach(main => main.remove());
  }

  // Add scope="col" to the th elements if they don't already have it
  const thElements = document.querySelectorAll('th');
  thElements.forEach(th => {
    if (!th.hasAttribute('scope')) {
      th.setAttribute('scope', 'col');
    }
  });
}

function modifyLoadedTables() {
  // Existing logic to modify tables...

  // You might need to re-run createTableHeaders here if the tables are generated dynamically
  createTableHeaders();
}

// Call the modifyLoadedTables function when necessary
modifyLoadedTables();