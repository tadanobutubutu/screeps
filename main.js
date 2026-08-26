// main.js

// Preserve existing code, exports, and functions
// ...

// Add the new function or change requested in the issue
const updateLanguageAttribute = () => {
  const htmlElement = document.querySelector('html');
  if (htmlElement) {
    htmlElement.setAttribute('lang', 'en');
  }
};

// Call the function to update the language attribute
updateLanguageAttribute();

// Continue with the rest of the main.js code
// ...