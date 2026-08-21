// Existing code from main.js
// ...

// Add the new function or change requested in the issue
function setLanguageAttribute() {
  const html = document.querySelector('html');
  if (html) {
    html.setAttribute('lang', 'en');
  }
}

// Call the function to set the language attribute
setLanguageAttribute();

// Existing code from main.js continues here
// ...