// Existing code from main.js before conflict markers
// <<<<<<< HEAD
// ... existing code ...
// >>>>>>> origin/main

// New function or changes requested in the issue
function setLanguageAttribute() {
  const htmlElement = document.querySelector('html');
  if (htmlElement) {
    htmlElement.setAttribute('lang', 'en');
  }
}

// Call the function to set the language attribute
setLanguageAttribute();

// ... existing code ...