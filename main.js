// Existing code and exports from main.js

// New function or changes requested in the issue
const setLanguageAttribute = () => {
  document.documentElement.lang = 'en';
};

// Ensure the language attribute is set when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', setLanguageAttribute);

// ... Rest of the main.js file with conflict markers preserved