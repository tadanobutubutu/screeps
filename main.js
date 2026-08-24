// Function to ensure lang attribute is set on HTML element
export function setHtmlLanguageAttribute(lang = 'en') {
  if (typeof document !== 'undefined') {
    const htmlElement = document.documentElement;
    if (htmlElement && !htmlElement.hasAttribute('lang')) {
      htmlElement.setAttribute('lang', lang);
    }
  }
}

// Call this during app initialization
if (typeof document !== 'undefined') {
  setHtmlLanguageAttribute();
}