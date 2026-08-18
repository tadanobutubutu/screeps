// Existing code from main.js, preserved
// ...

// New changes requested in the issue
const tableHeaders = document.querySelectorAll('th');

tableHeaders.forEach(header => {
  if (!header.hasAttribute('scope')) {
    header.setAttribute('scope', 'col');
  }
});

// Existing code from main.js, preserved
// ...