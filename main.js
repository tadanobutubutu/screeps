// TODO: This is the existing code that needs to be preserved
// ----- BEGIN ORIGINAL CODE (unchanged) -----
// Assuming main.js has a <html> tag, add the lang attribute based on your content
// For example, if the page is in English, set lang to 'en'

/**
 * Sets the language attribute on the HTML element
 * @param {string} lang - The language code (e.g., 'en', 'es', 'fr')
 */
function setLangAttribute(lang) {
  const htmlElement = document.documentElement;
  if (htmlElement && lang) {
    htmlElement.setAttribute('lang', lang);
  }
}

/**
 * Auto-detects the page language and sets the lang attribute
 * @returns {string|null} - The detected language code or null if no language detected
 */
function autoSetLangAttribute() {
  // Check for meta content-language tag
  const metaLang = document.querySelector('meta[http-equiv="content-language"]');
  if (metaLang && metaLang.content) {
    const lang = metaLang.content.split(',')[0].trim();
    setLangAttribute(lang);
    return lang;
  }

  // Check for html tag lang attribute (already set)
  const currentLang = document.documentElement.getAttribute('lang');
  if (currentLang) {
    return currentLang;
  }

  return null;
}

module.exports = { setLangAttribute, autoSetLangAttribute };