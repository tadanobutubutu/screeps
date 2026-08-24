// Existing code from main.js (preserved)
// ...

// New function or changes requested in the issue
function setLanguageAttribute() {
  // This function could be called in the initialization of the document
  // For example, it could be called in a script tag at the bottom of the HTML body
  document.documentElement.lang = 'en';
}

// Ensure the language attribute is set when the document is loaded
document.addEventListener('DOMContentLoaded', setLanguageAttribute);

// Continue with the rest of the main.js code (preserved)
// ...