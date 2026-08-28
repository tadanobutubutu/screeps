// TODO: Create or update the affected functions to be accessible

/**
 * Adds the lang attribute to the HTML element for accessibility.
 * This addresses REACT_015 from the accessibility insight report.
 * @param {string} langCode - The language code (e.g., 'en', 'es'). Defaults to 'en'.
 */
function addLangAttribute(langCode = 'en') {
  const htmlElement = document.querySelector('html');
  if (htmlElement) {
    htmlElement.setAttribute('lang', langCode);
  }
}

export { addLangAttribute };