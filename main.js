// Existing code from main.js
// ... (code before conflict markers)

// Add the new function or change requested in the issue
function setLanguageAttribute() {
  const htmlElement = document.querySelector('html');
  if (htmlElement) {
    htmlElement.setAttribute('lang', 'en');
  }
}

// Call the function to set the language attribute
setLanguageAttribute();

// ... (code after conflict markers)
// ... (rest of the main.js content)