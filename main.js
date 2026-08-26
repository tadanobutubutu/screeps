// TODO: This is the existing code that needs to be preserved
// ----- BEGIN ORIGINAL CODE (unchanged) -----

export function setDocumentLanguage(lang = 'en') {
  document.documentElement.lang = lang;
}

export function initializeLanguage() {
  // Assuming 'en' is the default language for this application.
  setDocumentLanguage('en');
}

// Call initializeLanguage when the application starts, for example, in a component lifecycle method or when the app is loaded.
// initializeLanguage();