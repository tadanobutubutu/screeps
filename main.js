// Existing code from main.js
// ... (preserved code)

// New function or changes requested in the issue
const setLanguageAttribute = () => {
  const htmlElement = document.querySelector('html');
  if (htmlElement) {
    htmlElement.setAttribute('lang', 'en');
  }
};

// Call the function to set the language attribute
setLanguageAttribute();

// ... (rest of the preserved code)