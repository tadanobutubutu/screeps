// Existing code from main.js
// ... (Preserve all existing code, exports, and functions)

// New function or changes requested in the issue
// Add the lang attribute to the root HTML element
export function updateRootLangAttribute() {
  const htmlElement = document.documentElement;
  htmlElement.setAttribute('lang', 'en');
}

// Ensure the function is called when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', updateRootLangAttribute);

// ... (Preserve all existing code, exports, and functions)