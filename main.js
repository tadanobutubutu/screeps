// TODO: This is the existing code that needs to be preserved
// ... (any existing code from main.js)

// Create a utility function to create a web resource button suitable for accessibility
function createAccessibleButton(url, text) {
  const button = document.createElement('button');
  button.setAttribute('type', 'button');
  button.setAttribute('aria-label', `Go to ${text}`);
  button.textContent = text;
  button.href = url;
  button.target = '_blank';
  return button;
}

// Export the function if needed
export { createAccessibleButton };