// Existing code from main.js
// ...

// New function or change requested in the issue
function setLanguageAttribute() {
  const htmlElement = document.querySelector('html');
  if (htmlElement) {
    htmlElement.setAttribute('lang', 'en');
  }
}

// Call the function to set the language attribute
setLanguageAttribute();

// Existing code from main.js
// ...