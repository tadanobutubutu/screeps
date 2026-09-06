// TODO: This is the existing code that needs to be preserved
// ----- BEGIN ORIGINAL CODE (unchanged) -----
// Assuming main.js has a <html> tag, add the lang attribute based on your content
// For example, if the page is in English, set lang to 'en'

/**
 * Sets the lang attribute on the <html> tag
 * @param {string} lang - The language code (e.g., 'en', 'es', 'fr')
 */
function setHtmlLang(lang) {
  const htmlElement = document.querySelector('html');
  if (htmlElement) {
    htmlElement.setAttribute('lang', lang);
  }
}

// Initialize with English as default
setHtmlLang('en');

module.exports = { setHtmlLang };