// Original content of main.js
// ... (existing code) ...

// New function or change requested in the issue
const setLanguageAttribute = (element) => {
  if (element) {
    element.setAttribute('lang', 'en');
  }
};

// Usage example
setLanguageAttribute(document.documentElement);

// ... (remaining existing code) ...