// Existing code from main.js
// ...

// New changes for the issue
const thElements = document.querySelectorAll('th');
thElements.forEach(th => {
  if (!th.hasAttribute('scope')) {
    th.setAttribute('scope', 'col');
  }
});

// Existing code continues...
// ...