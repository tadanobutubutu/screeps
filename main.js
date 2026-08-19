// Existing code from main.js
// ... (Preserve all existing code, exports, and functions)

// Add the following line to ensure the root element has a lang attribute
document.documentElement.lang = 'en';

// ... (Preserve all existing code, exports, and functions)

// If there are any existing functions or code that manipulate the document's root element,
// you may need to adjust them to respect the new lang attribute. For example:

function setLanguage(language) {
  document.documentElement.lang = language;
}

// ... (Preserve all existing code, exports, and functions)