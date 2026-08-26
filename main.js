export function setDocumentLanguage(lang = 'en') {
  document.documentElement.lang = lang;
}

export function initializeLanguage() {
  // Assuming 'en' is the default language for this application.
  setDocumentLanguage('en');
}

// Call initializeLanguage when the application starts, for example, in a component lifecycle method or when the app is loaded.
// initializeLanguage();

// Add a new function to check for the presence of multiple <main> elements
export function checkForMultipleMainElements() {
  const mainElements = document.querySelectorAll('main');
  if (mainElements.length > 1) {
    console.warn('Multiple <main> elements found on the page. Only one <main> element should be present.');
  }
}

// Call the new function on component mount or when the DOM is ready
document.addEventListener('DOMContentLoaded', checkForMultipleMainElements);

// TODO: This is the existing code that needs to be preserved
// ----- BEGIN ORIGINAL CODE (unchanged) -----