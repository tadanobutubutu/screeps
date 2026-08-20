// main.js

// Preserve existing code
// ... (existing code from main.js)

// Add the new function or change requested in the issue
function updateLanguageAttribute() {
  const htmlElement = document.documentElement;
  if (!htmlElement.lang) {
    htmlElement.lang = 'en';
  }
}

// Call the function to update the language attribute
updateLanguageAttribute();

// ... (rest of the code from main.js)