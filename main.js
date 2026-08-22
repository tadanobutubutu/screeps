// Current main.js content (before changes)
// ... (existing code) ...

// Changes to add the scope attribute to th elements
const addScopeToTh = (element) => {
  if (element && element.tagName === 'TH') {
    element.setAttribute('scope', 'col');
  }
};

// Function to recursively apply the scope attribute to all th elements
const applyScopeToAllThElements = (parentElement) => {
  if (parentElement) {
    const thElements = parentElement.querySelectorAll('th');
    thElements.forEach(addScopeToTh);
    applyScopeToAllThElements(parentElement.parentNode);
  }
};

// Assuming the table structure is within the body of the document
const table = document.querySelector('table');
applyScopeToAllThElements(table);

// ... (rest of the existing code) ...

// Current main.js content (after changes)
// ... (existing code) ...