// TODO: This is the existing code that needs to be preserved
// Functions to ensure the element has an id, add aria-label, render dependency graphs
// (Previously existing code that needs to be preserved)

// New function or changes requested in the issue
function createAccessibleWebResourceButton(resourceName, url, iconClass) {
  const button = document.createElement('button');
  button.className = `resource-button ${iconClass}`;
  button.setAttribute('aria-label', `Visit ${resourceName}`);
  button.setAttribute('role', 'link');

  const link = document.createElement('a');
  link.href = url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.setAttribute('aria-hidden', 'true');

  const icon = document.createElement('i');
  icon.className = `icon ${iconClass}`;
  link.appendChild(icon);

  button.appendChild(link);

  // Add keyboard navigation support
  button.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      window.open(url, '_blank');
    }
  });

  return button;
}

// main.js

// ... (existing code from main.js)

// TODO: Implement the required changes to improve accessibility for the addBook function or form
// Assuming that the `addBook` function or form is within the scope of the file and that the
// changes needed are related to adding ARIA roles and labels to improve accessibility.

// Example of adding ARIA roles and labels for an addBook form element
function addBook() {
  // ... (existing addBook function code)

  // Add ARIA roles and labels to improve accessibility
  const addBookForm = document.getElementById('addBookForm');
  addBookForm.setAttribute('role', 'form');
  addBookForm.setAttribute('aria-labelledby', 'addBookLabel');

  const addBookLabel = document.createElement('label');
  addBookLabel.id = 'addBookLabel';
  addBookLabel.htmlFor = 'addBookForm';
  addBookLabel.textContent = 'Add a new book';
  addBookForm.insertBefore(addBookLabel, addBookForm.firstChild);
}

// ... (rest of the existing code from main.js)

module.exports = {
  // Existing exports
  // ...
  createAccessibleWebResourceButton, // Export the new function
  addBook, // Export the addBook function
};