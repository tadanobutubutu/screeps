// Existing code from main.js
// ...

// New changes requested in the issue
const addScopeToTh = (element) => {
  if (element && element.tagName === 'TH') {
    element.setAttribute('scope', 'col');
  }
};

// Function to update all th elements in the document
const updateTableHeaders = () => {
  const thElements = document.querySelectorAll('th');
  thElements.forEach(addScopeToTh);
};

// Call the function to update headers when the document is loaded
document.addEventListener('DOMContentLoaded', updateTableHeaders);

// Existing code from main.js
// ...