export function setDocumentLanguage(lang = 'en') {
  document.documentElement.lang = lang;
}

// Add a new function to check for the presence of multiple <main> elements
export function checkForMultipleMainElements() {
  const mainElements = document.querySelectorAll('main');
  if (mainElements.length > 1) {
    console.warn('Multiple <main> elements found on the page. Only one <main> element should be present.');
  }
}

// Call the new function on component mount or when the DOM is ready
document.addEventListener('DOMContentLoaded', checkForMultipleMainElements);