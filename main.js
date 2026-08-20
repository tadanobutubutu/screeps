// Existing code from main.js
// ... (Preserve all existing code, exports, and functions)

// New function or changes requested in the issue
// Adding the lang attribute to the root HTML element
export function setLanguageAttribute() {
  const htmlElement = document.querySelector('html');
  if (htmlElement) {
    htmlElement.setAttribute('lang', 'en');
  }
}

// ... (Preserve all existing code, exports, and functions)

// Ensure that the function is called if needed, for example, on the initial load
document.addEventListener('DOMContentLoaded', setLanguageAttribute);