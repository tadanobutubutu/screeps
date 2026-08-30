// TODO: This is the existing code that needs to be preserved

// New utility function to create a web resource button suitable for accessibility
function createAccessibleWebResourceButton(url, text) {
  const button = document.createElement('button');
  button.setAttribute('type', 'button');
  button.setAttribute('aria-label', text);
  button.innerHTML = `<a href="${url}" target="_blank">${text}</a>`;
  return button;
}

// Existing code from main.js (not changed)
// ...